from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Parrocchia, UserProfile

class ParrocchiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parrocchia
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    parrocchia = ParrocchiaSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'email', 'ruolo', 'parrocchia')