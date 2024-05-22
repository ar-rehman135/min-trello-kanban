import graphene
from .models import Column, Card
from datetime import datetime
import uuid


# Function to update card row and rearrange other cards
def update_card_row(card_id, from_row_number, to_row_number):
    if from_row_number == to_row_number:
        return  # No change needed

    # Fetch all cards that need to be rearranged
    cards = list(Card.scan())
    cards = sorted(cards, key=lambda card: card.row_number)

    if from_row_number < to_row_number:
        # Shift cards down
        for card in cards:
            if from_row_number < card.row_number <= to_row_number:
                card.row_number -= 1
                card.save()
    else:
        # Shift cards up
        for card in cards:
            if to_row_number <= card.row_number < from_row_number:
                card.row_number += 1
                card.save()

    # Update the moved card's row number
    card_to_move = Card.get(card_id)
    card_to_move.row_number = to_row_number
    card_to_move.save()


# Define CardType with additional information for column and created_at
class CardType(graphene.ObjectType):
    id = graphene.String()
    title = graphene.String()
    description = graphene.String()
    column_id = graphene.String()
    created_at = graphene.String()
    row_number = graphene.Int()


# Define ColumnType with resolver to fetch cards
class ColumnType(graphene.ObjectType):
    id = graphene.String()
    title = graphene.String()
    column_number = graphene.Int()
    cards = graphene.List(CardType)

    def resolve_cards(parent, info):
        return sorted(
            Card.scan(Card.column_id == parent.id),
            key=lambda card: card.row_number,
        )


# Query class for fetching columns, cards, and columns with cards
class Query(graphene.ObjectType):
    all_columns = graphene.List(ColumnType)
    all_cards = graphene.List(CardType)
    column_by_id = graphene.Field(ColumnType, id=graphene.String(required=True))
    card_by_id = graphene.Field(CardType, id=graphene.String(required=True))

    def resolve_all_columns(root, info):
        return sorted(Column.scan(), key=lambda card: card.column_number)

    def resolve_all_cards(root, info):
        # Query cards using the created_at index and order by created_at in descending order
        return sorted(Card.scan(), key=lambda card: card.row_number)

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
        column_number = graphene.Int(required=True)

    def mutate(self, info, title, column_number):
        column = Column(id=str(uuid.uuid4()), title=title, column_number=column_number)
        column.save()
        return CreateColumn(column=column)


# Mutation for creating a new card
class CreateCard(graphene.Mutation):
    card = graphene.Field(CardType)

    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        row_number = graphene.Int(required=True)
        column_id = graphene.String(required=True)

    def mutate(self, info, title, description, column_id, row_number):
        card = Card(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            column_id=column_id,
            row_number=row_number,
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
        title = graphene.String()
        column_number = graphene.Int()

    def mutate(self, info, id, title=None, column_number=None):
        try:
            column = Column.get(id)
            actions = []
            if title is not None:
                actions.append(Column.title.set(title))
            if column_number is not None:
                actions.append(Column.column_number.set(column_number))

            if actions:
                column.update(actions=actions)

            return UpdateColumn(column=column)
        except Column.DoesNotExist:
            raise Exception("Column not found")


# Mutation for updating a card
class UpdateCard(graphene.Mutation):
    card = graphene.Field(CardType)

    class Arguments:
        id = graphene.String(required=True)
        title = graphene.String()
        description = graphene.String()

    def mutate(self, info, id, title=None, description=None):
        try:
            card = Card.get(id)
            actions = []
            if title is not None:
                actions.append(Card.title.set(title))
            if description is not None:
                actions.append(Card.description.set(description))

            if actions:
                card.update(actions=actions)

            return UpdateCard(card=card)
        except Card.DoesNotExist:
            raise Exception("Card not found")


# Mutation for updating a card's row number and rearranging other cards
class UpdateCardRow(graphene.Mutation):
    card = graphene.Field(CardType)

    class Arguments:
        id = graphene.String(required=True)
        from_row_number = graphene.Int(required=True)
        to_row_number = graphene.Int(required=True)

    def mutate(self, info, id, from_row_number, to_row_number):
        update_card_row(id, from_row_number, to_row_number)
        try:
            card = Card.get(id)
            return UpdateCardRow(card=card)
        except Card.DoesNotExist:
            raise Exception("Card not found")


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
    update_card_row = UpdateCardRow.Field()
    delete_column = DeleteColumn.Field()
    delete_card = DeleteCard.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
