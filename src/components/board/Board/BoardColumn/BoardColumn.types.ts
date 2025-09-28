import React from "react";
import { IssueStatus, MetaResponse } from "../../../../types/board";

export interface BoardColumnProps {
    status: MetaResponse;
    children: React.ReactNode;
}
