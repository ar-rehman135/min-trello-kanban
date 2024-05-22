import { gql } from "@apollo/client";

export const CREATE_CARD_MUTATION = gql`
  mutation CreateCard(
    $title: String!
    $description: String!
    $columnId: String!
    $rowNumber: Int!
  ) {
    createCard(
      title: $title
      description: $description
      columnId: $columnId
      rowNumber: $rowNumber
    ) {
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

export const CREATE_COLUMN_MUTATION = gql`
  mutation CreateColumn($title: String!, $columnNumber: Int!) {
    createColumn(title: $title, columnNumber: $columnNumber) {
      column {
        id
        title
      }
    }
  }
`;
