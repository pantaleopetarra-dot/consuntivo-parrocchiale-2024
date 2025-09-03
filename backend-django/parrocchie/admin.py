from django.contrib import admin
from .models import Parrocchia, UserProfile

@admin.register(Parrocchia)
class ParrocchiaAdmin(admin.ModelAdmin):
    list_display = ('codice', 'nome', 'comune', 'telefono', 'iban')
    search_fields = ('nome', 'comune', 'codice')
    list_filter = ('comune',)
    ordering = ('nome',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        try:
            profile = request.user.userprofile
            if profile.ruolo == 'diocesi':
                return qs
            else:
                return qs.filter(id=profile.parrocchia.id)
        except:
            return qs.none()


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'parrocchia', 'ruolo')
    list_filter = ('ruolo', 'parrocchia')
    search_fields = ('user__username', 'parrocchia__nome')