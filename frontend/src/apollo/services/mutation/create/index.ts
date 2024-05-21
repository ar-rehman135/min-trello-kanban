import { gql } from "@apollo/client";

export const CREATE_CARD_MUTATION = gql`
  mutation CreateCard(
    $title: String!
    $description: String!
    $columnId: String!
  ) {
    createCard(title: $title, description: $description, columnId: $columnId) {
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
  mutation CreateColumn($title: String!) {
    createColumn(title: $title) {
      column {
        id
        title
      }
    }
  }
`;
