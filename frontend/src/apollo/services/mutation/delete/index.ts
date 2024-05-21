import { gql } from "@apollo/client";

export const DELETE_CARD_MUTATION = gql`
  mutation DeleteCard($id: String!) {
    deleteCard(id: $id) {
      success
    }
  }
`;

export const DELETE_COLUMN_MUTATION = gql`
  mutation DeleteColumn($id: String!) {
    deleteColumn(id: $id) {
      success
    }
  }
`;
