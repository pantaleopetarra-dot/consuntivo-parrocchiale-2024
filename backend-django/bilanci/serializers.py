from rest_framework import serializers
from .models import BilancioConsuntivo, Entrata, Uscita, GestioneSpeciale, CodiceContabile

class CodiceContabileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodiceContabile
        fields = '__all__'

class EntrataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrata
        fields = '__all__'

class UscitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Uscita
        fields = '__all__'

class GestioneSpecialeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GestioneSpeciale
        fields = '__all__'

class BilancioConsuntivoSerializer(serializers.ModelSerializer):
    entrate = EntrataSerializer(many=True, read_only=True)
    uscite = UscitaSerializer(many=True, read_only=True)
    gestioni_speciali = GestioneSpecialeSerializer(many=True, read_only=True)

    class Meta:
        model = BilancioConsuntivo
        fields = '__all__'