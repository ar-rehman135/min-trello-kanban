from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection

from django.conf import settings
from datetime import datetime


class CreatedAtIndex(GlobalSecondaryIndex):
    """
    This class represents a global secondary index to query cards by created_at.
    """

    class Meta:
        index_name = "created_at-index"
        read_capacity_units = 5
        write_capacity_units = 5
        projection = AllProjection()

    created_at = UTCDateTimeAttribute(hash_key=True)


class BaseModel(Model):
    class Meta:
        region = settings.AWS_REGION
        host = settings.DYNAMODB_HOST
        aws_access_key_id = settings.AWS_ACCESS_KEY_ID
        aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY


class Column(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = "Column"

    id = UnicodeAttribute(hash_key=True)
    title = UnicodeAttribute()


class Card(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = "Card"

    id = UnicodeAttribute(hash_key=True)
    title = UnicodeAttribute()
    description = UnicodeAttribute()
    column_id = UnicodeAttribute()
    created_at = UTCDateTimeAttribute(default=datetime.now)

    created_at_index = CreatedAtIndex()


def create_tables():
    if not Column.exists():
        Column.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)
    if not Card.exists():
        Card.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)
