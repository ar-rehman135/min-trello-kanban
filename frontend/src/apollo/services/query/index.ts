import { gql} from "@apollo/client";

export const GET_ALL_COLUMNS = gql`
  query GetAllColumns {
    allColumns {
      id
      title
      columnNumber
      cards {
        id
        title
        description
        createdAt
        rowNumber
      }
    }
  }
`;
