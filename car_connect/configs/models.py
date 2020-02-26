from django.db import models


# Create your models here.

class TimeStampedModel(models.Model):
    reg_dt = models.DateTimeField(db_column='reg_dt', blank=True, null=True, auto_now_add=True)
    mod_dt = models.DateTimeField(db_column='mod_dt', blank=True, null=True, auto_now=True)
    use = models.BooleanField(db_column='use', default=True)

    class Meta:
        abstract = True
