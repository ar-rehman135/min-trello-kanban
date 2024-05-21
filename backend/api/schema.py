import graphene
from .models import Column, Card
from datetime import datetime
import uuid


# Define CardType with additional information for column and created_at
class CardType(graphene.ObjectType):
    id = graphene.String()
    title = graphene.String()
    description = graphene.String()
    column_id = graphene.String()
    created_at = graphene.String()


# Define ColumnType with resolver to fetch cards
class ColumnType(graphene.ObjectType):
    id = graphene.String()
    title = graphene.String()
    cards = graphene.List(CardType)

    def resolve_cards(parent, info):
        return list(Card.scan(Card.column_id == parent.id))


# Query class for fetching columns, cards, and columns with cards
class Query(graphene.ObjectType):
    all_columns = graphene.List(ColumnType)
    all_cards = graphene.List(CardType)
    column_by_id = graphene.Field(ColumnType, id=graphene.String(required=True))
    card_by_id = graphene.Field(CardType, id=graphene.String(required=True))

    def resolve_all_columns(root, info):
        return list(Column.scan())

    def resolve_all_cards(root, info):
        # Query cards using the created_at index and order by created_at in descending order
        return list(Card.created_at_index.scan(ScanIndexForward=False))

    def resolve_column_by_id(root, info, id):
        try:
            return Column.get(id)
        except Column.DoesNotExist:
            return None

    def resolve_card_by_id(root, info, id):
        try:
            return Card.get(id)
        except Card.DoesNotExist:
            return None


# Mutation for creating a new column
class CreateColumn(graphene.Mutation):
    column = graphene.Field(ColumnType)

    class Arguments:
        title = graphene.String(required=True)

    def mutate(self, info, title):
        column = Column(id=str(uuid.uuid4()), title=title)
        column.save()
        return CreateColumn(column=column)


# Mutation for creating a new card
class CreateCard(graphene.Mutation):
    card = graphene.Field(CardType)

    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        column_id = graphene.String(required=True)

    def mutate(self, info, title, description, column_id):
        card = Card(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            column_id=column_id,
        )
        card.save()
        return CreateCard(card=card)


# Mutation for updating a card's column
class UpdateCardColumn(graphene.Mutation):
    card = graphene.Field(CardType)

    class Arguments:
        id = graphene.String(required=True)
        column_id = graphene.String(required=True)

    def mutate(self, info, id, column_id):
        try:
            card = Card.get(id)
            card.update(actions=[Card.column_id.set(column_id)])
            return UpdateCardColumn(card=card)
        except Card.DoesNotExist:
            raise Exception("Card not found")


# Mutation for updating a column
class UpdateColumn(graphene.Mutation):
    column = graphene.Field(ColumnType)

    class Arguments:
        id = graphene.String(required=True)
        title = graphene.String(required=True)

    def mutate(self, info, id, title):
        try:
            column = Column.get(id)
            column.update(actions=[Column.title.set(title)])
            return UpdateColumn(column=column)
        except Column.DoesNotExist:
            raise Exception("Column not found")


# Mutation for updating a card
class UpdateCard(graphene.Mutation):
    card = graphene.Field(CardType)

    class Arguments:
        id = graphene.String(required=True)
        title = graphene.String(required=True)
        description = graphene.String(required=True)

    def mutate(self, info, id, title, description):
        try:
            card = Card.get(id)
            card.update(
                actions=[Card.title.set(title), Card.description.set(description)]
            )
            return UpdateCard(card=card)
        except Card.DoesNotExist:
            raise Exception("Card not found")


# Mutation for deleting a column
class DeleteColumn(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.String(required=True)

    def mutate(self, info, id):
        try:
            column = Column.get(id)
            # Optionally, delete all associated cards
            cards = list(Card.scan(Card.column_id == column.id))
            with Card.batch_write() as batch:
                for card in cards:
                    batch.delete(card)
            column.delete()
            return DeleteColumn(success=True)
        except Column.DoesNotExist:
            return DeleteColumn(success=False)


# Mutation for deleting a card
class DeleteCard(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.String(required=True)

    def mutate(self, info, id):
        try:
            card = Card.get(id)
            card.delete()
            return DeleteCard(success=True)
        except Card.DoesNotExist:
            return DeleteCard(success=False)


# Define the schema with query and mutation
class Mutation(graphene.ObjectType):
    create_column = CreateColumn.Field()
    create_card = CreateCard.Field()
    update_card_column = UpdateCardColumn.Field()
    update_column = UpdateColumn.Field()
    update_card = UpdateCard.Field()
    delete_column = DeleteColumn.Field()
    delete_card = DeleteCard.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
