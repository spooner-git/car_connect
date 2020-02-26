# Create your views here.
import collections

import requests
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views import View
from django.views.generic import TemplateView

from configs.const import USE

class IndexView(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        return context

# class SearchResultView(TemplateView):
#     template_name = 'connect_search_result.html'

#     def get_context_data(self, **kwargs):
#         context = super(SearchResultView, self).get_context_data(**kwargs)
#         return context
