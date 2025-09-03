from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserProfileSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint per il login.
    Accetta: { "username": "email", "password": "..." }
    """
    username = request.data.get('username')
    password = request.data.get('password')

    # Cerca l'utente per email (username)
    try:
        user = User.objects.get(email=username)
        username = user.username
    except User.DoesNotExist:
        pass

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        try:
            profile = user.userprofile
            return Response({
                'message': 'Login effettuato con successo',
                'ruolo': profile.ruolo,
                'parrocchia': profile.parrocchia.nome if profile.parrocchia else None,
                'id_parrocchia': profile.parrocchia.id if profile.parrocchia else None
            })
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profilo utente non trovato'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Email o password non validi'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    Restituisce i dati del profilo utente loggato.
    """
    try:
        profile = request.user.userprofile
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profilo non trovato'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout dell'utente.
    """
    logout(request)
    return Response({'message': 'Logout effettuato con successo'})