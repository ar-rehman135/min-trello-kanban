from django.views import View
from graphene_django.views import GraphQLView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .schema import schema


class CustomGraphQLView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request, *args, **kwargs):
        view = GraphQLView.as_view(schema=schema, graphiql=True)
        return view(request)

    def post(self, request, *args, **kwargs):
        view = GraphQLView.as_view(schema=schema, graphiql=True)
        return view(request)
