from django.db import models
from django.core.exceptions import ValidationError
from parrocchie.models import Parrocchia

class CodiceContabile(models.Model):
    """
    Codici validi per entrate, uscite e gestioni speciali.
    Esempio: 11 = Offerte, A = Cooperazione Diocesana
    """
    codice = models.CharField(max_length=10, unique=True)
    descrizione = models.CharField(max_length=100)
    tipo = models.CharField(max_length=10, choices=[
        ('entrata', 'Entrata'),
        ('uscita', 'Uscita'),
        ('speciale', 'Gestione Speciale')
    ])
    obbligatorio = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.codice} - {self.descrizione}"

class BilancioConsuntivo(models.Model):
    parrocchia = models.ForeignKey(Parrocchia, on_delete=models.CASCADE)
    anno = models.IntegerField(default=2024)
    stato = models.CharField(
        max_length=10,
        choices=[('bozza', 'Bozza'), ('inviato', 'Inviato'), ('approvato', 'Approvato')],
        default='bozza'
    )
    data_invio = models.DateField(null=True, blank=True)
    data_approvazione = models.DateField(null=True, blank=True)

    # Dati statistici (dalla prima pagina del file Excel)
    abitanti = models.IntegerField(default=0)
    sacerdoti = models.IntegerField(default=0)
    battesimi = models.IntegerField(default=0)
    matrimoni = models.IntegerField(default=0)
    sepolture = models.IntegerField(default=0)
    cresime = models.IntegerField(default=0)
    catechisti = models.IntegerField(default=0)
    volontari = models.IntegerField(default=0)

    # Dati bancari
    numero_cc = models.CharField(max_length=20, blank=True, null=True)
    iban = models.CharField(max_length=27, blank=True, null=True)

    # Totali calcolati
    totale_entrate = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    totale_uscite = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    risultato_gestionale = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Contributi diocesani (calcolati automaticamente)
    contributo_2pc = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # 2% su entrate ordinarie
    contributo_10pc = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # 10% su affitti
    totale_contributo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ('parrocchia', 'anno')
        verbose_name = "Bilancio Consuntivo"
        verbose_name_plural = "Bilanci Consuntivi"

    def calcola_totali(self):
        entrate = self.entrate.aggregate(total=models.Sum('importo'))['total'] or 0
        uscite = self.uscite.aggregate(total=models.Sum('importo'))['total'] or 0

        self.totale_entrate = entrate
        self.totale_uscite = uscite
        self.risultato_gestionale = entrate - uscite

        # Calcola contributi
        self.calcola_contributi()
        self.save()

    def calcola_contributi(self):
        # 2% su entrate ordinarie (codici 11, 12, 13, ecc.)
        entrate_ordinarie = self.entrate.filter(
            models.Q(codice='11') |
            models.Q(codice='12') |
            models.Q(codice='13') |
            models.Q(codice='1') |
            models.Q(codice='2') |
            models.Q(codice='3')
        ).aggregate(total=models.Sum('importo'))['total'] or 0

        # 10% su affitti (codice 14 o causale con "affitto")
        entrate_affitti = self.entrate.filter(
            models.Q(codice='14') |
            models.Q(causale1__icontains='affitto') |
            models.Q(causale2__icontains='affitto') |
            models.Q(causale3__icontains='affitto')
        ).aggregate(total=models.Sum('importo'))['total'] or 0

        self.contributo_2pc = round(entrate_ordinarie * 0.02, 2)
        self.contributo_10pc = round(entrate_affitti * 0.10, 2)
        self.totale_contributo = round(self.contributo_2pc + self.contributo_10pc, 2)
        self.save()

    def __str__(self):
        return f"{self.parrocchia.nome} - {self.anno}"


class Entrata(models.Model):
    bilancio = models.ForeignKey(BilancioConsuntivo, on_delete=models.CASCADE, related_name='entrate')
    giorno = models.IntegerField(null=True, blank=True, help_text="Giorno del mese")
    mese = models.IntegerField(
        choices=[(i, i) for i in range(1, 13)],
        help_text="Mese dell'anno"
    )
    codice = models.CharField(max_length=10, help_text="Codice del piano dei conti")
    causale1 = models.CharField(max_length=50, blank=True)
    causale2 = models.CharField(max_length=50, blank=True)
    causale3 = models.CharField(max_length=50, blank=True)
    importo = models.DecimalField(max_digits=10, decimal_places=2)

    def clean(self):
        # Validazione codice contabile
        if self.codice:
            try:
                codice_obj = CodiceContabile.objects.get(codice=self.codice)
                if codice_obj.tipo != 'entrata':
                    raise ValidationError(f'Il codice "{self.codice}" non è un codice di entrata.')
            except CodiceContabile.DoesNotExist:
                raise ValidationError(f'Codice "{self.codice}" non valido. Controlla il piano dei conti.')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
        self.bilancio.calcola_totali()

    def delete(self, *args, **kwargs):
        bilancio = self.bilancio
        super().delete(*args, **kwargs)
        bilancio.calcola_totali()

    def __str__(self):
        return f"{self.codice} - {self.importo}€"


class Uscita(models.Model):
    bilancio = models.ForeignKey(BilancioConsuntivo, on_delete=models.CASCADE, related_name='uscite')
    giorno = models.IntegerField(null=True, blank=True)
    mese = models.IntegerField(choices=[(i, i) for i in range(1, 13)])
    codice = models.CharField(max_length=10)
    causale1 = models.CharField(max_length=50, blank=True)
    causale2 = models.CharField(max_length=50, blank=True)
    causale3 = models.CharField(max_length=50, blank=True)
    importo = models.DecimalField(max_digits=10, decimal_places=2)

    def clean(self):
        if self.codice:
            try:
                codice_obj = CodiceContabile.objects.get(codice=self.codice)
                if codice_obj.tipo != 'uscita':
                    raise ValidationError(f'Il codice "{self.codice}" non è un codice di uscita.')
            except CodiceContabile.DoesNotExist:
                raise ValidationError(f'Codice "{self.codice}" non valido.')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
        self.bilancio.calcola_totali()

    def delete(self, *args, **kwargs):
        bilancio = self.bilancio
        super().delete(*args, **kwargs)
        bilancio.calcola_totali()

    def __str__(self):
        return f"{self.codice} - {self.importo}€"


class GestioneSpeciale(models.Model):
    TIPI = [
        ('asilo', 'Asilo'),
        ('scuola_materna', 'Scuola Materna'),
        ('scuola_elementare', 'Scuola Elementare'),
        ('media', 'Scuola Media'),
        ('pensionato', 'Pensionato'),
        ('altro', 'Altro'),
    ]
    bilancio = models.ForeignKey(BilancioConsuntivo, on_delete=models.CASCADE, null=True, blank=True, related_name='gestioni_speciali')
    tipo = models.CharField(max_length=20, choices=TIPI)
    entrata = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    uscita = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.get_tipo_display()} - Entrate: {self.entrata}, Uscite: {self.uscita}"