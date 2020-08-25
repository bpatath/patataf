import { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { ApolloError } from "@apollo/client";

import { authResult } from "~/actions/auth";
import { ErrorCode, hasError } from "~/utils/error";

const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      id
    }
  }
`;

export default function useLanding(): [ApolloError | undefined] {
  const { loading, error, data } = useQuery(GET_VIEWER);
  const dispatch = useDispatch();
  useEffect(() => {
    if (loading) return;
    if (hasError(error, ErrorCode.UNAUTHENTICATED)) {
      dispatch(authResult(false));
    } else {
      dispatch(authResult(data != null));
    }
  }, [loading, error, data]);
  return [error];
}
