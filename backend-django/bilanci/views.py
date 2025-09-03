from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import BilancioConsuntivo
from .serializers import BilancioConsuntivoSerializer
from .excel_export import genera_excel_consuntivo
from .excel_import import importa_da_excel


class BilancioViewSet(viewsets.ModelViewSet):
    serializer_class = BilancioConsuntivoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user
        try:
            profile = user.userprofile
            anno = self.request.query_params.get('anno', 2024)

            if profile.ruolo == 'diocesi':
                return BilancioConsuntivo.objects.filter(anno=anno)
            else:
                return BilancioConsuntivo.objects.filter(parrocchia=profile.parrocchia, anno=anno)
        except:
            return BilancioConsuntivo.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        try:
            profile = user.userprofile
            if profile.ruolo == 'parrocchia':
                serializer.save(parrocchia=profile.parrocchia)
        except:
            pass

    @action(detail=True, methods=['post'])
    def invia(self, request, pk=None):
        bilancio = self.get_object()
        bilancio.stato = 'inviato'
        bilancio.save()

        # Invia email all'Ufficio Economato
        try:
            send_mail(
                subject=f"[Consuntivo Parrocchiale] Bilancio inviato: {bilancio.parrocchia.nome}",
                message=f"""
La parrocchia {bilancio.parrocchia.nome} ha inviato il bilancio consuntivo per l'anno {bilancio.anno}.

- Totale entrate: € {bilancio.totale_entrate:.2f}
- Totale uscite: € {bilancio.totale_uscite:.2f}
- Contributo diocesano: € {bilancio.totale_contributo:.2f}

Accedi al sistema per visualizzare e approvare il bilancio:
https://consuntivo-diocesi.it/diocesi

Firmato,
Sistema Consuntivo Parrocchiale
""",
                recipient_list=[settings.DIOCESI_EMAIL],
                from_email=settings.DEFAULT_FROM_EMAIL,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Errore invio email: {e}")

        return Response({'status': 'Bilancio inviato e notifica email inviata'})

    @action(detail=True, methods=['post'])
    def approva(self, request, pk=None):
        bilancio = self.get_object()
        bilancio.stato = 'approvato'
        bilancio.save()
        return Response({'status': 'Bilancio approvato'})

    @action(detail=True, methods=['get'])
    def export_excel(self, request, pk=None):
        bilancio = self.get_object()
        buffer = genera_excel_consuntivo(bilancio)
        response = HttpResponse(buffer, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename=consuntivo_{bilancio.parrocchia.codice}_{bilancio.anno}.xlsx'
        return response

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def importa_excel(self, request, pk=None):
        bilancio = self.get_object()
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'Nessun file caricato'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            messaggi = importa_da_excel(bilancio, file)
            return Response({
                'status': 'import_success',
                'dettagli': messaggi
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)