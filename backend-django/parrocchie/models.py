from django.db import models
from django.contrib.auth.models import User

class Parrocchia(models.Model):
    codice = models.CharField(max_length=10, unique=True, help_text="Codice univoco della parrocchia")
    nome = models.CharField(max_length=100)
    comune = models.CharField(max_length=50)
    indirizzo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    iban = models.CharField(max_length=27, blank=True, null=True)
    numero_cc = models.CharField(max_length=20, blank=True, null=True)
    ufficio_parrocchiale = models.IntegerField(default=0, help_text="Numero persone addette all'ufficio")
    parroco = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='parroco_di')

    def __str__(self):
        return f"{self.nome} ({self.comune})"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    parrocchia = models.ForeignKey(Parrocchia, on_delete=models.SET_NULL, null=True, blank=True)
    ruolo = models.CharField(
        max_length=10,
        choices=[
            ('parrocchia', 'Parrocchia'),
            ('diocesi', 'Ufficio Diocesano'),
        ],
        default='parrocchia'
    )

    def __str__(self):
        return f"{self.user.username} - {self.ruolo}"