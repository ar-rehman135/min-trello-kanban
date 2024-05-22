import { gql } from "@apollo/client";

export const UPDATE_CARD_MUTATION = gql`
  mutation UpdateCard($id: String!, $title: String!, $description: String!) {
    updateCard(id: $id, title: $title, description: $description) {
      card {
        id
        title
        description
        columnId
        createdAt
      }
    }
  }
`;

export const UPDATE_CARD_COLUMN_MUTATION = gql`
  mutation UpdateCardColumn($id: String!, $columnId: String!) {
    updateCardColumn(id: $id, columnId: $columnId) {
      card {
        id
        title
        description
        columnId
        createdAt
      }
    }
  }
`;

export const UPDATE_CARD_ROW_MUTATION = gql`
  mutation UpdateCardRow(
    $id: String!
    $fromRowNumber: Int!
    $toRowNumber: Int!
  ) {
    updateCardRow(
      id: $id
      fromRowNumber: $fromRowNumber
      toRowNumber: $toRowNumber
    ) {
      card {
        id
        title
        description
        columnId
        createdAt
        rowNumber
      }
    }
  }
`;
