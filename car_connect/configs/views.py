from django.shortcuts import redirect
from django.views.generic import TemplateView


# Create your views here.

class IndexView(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        return context
