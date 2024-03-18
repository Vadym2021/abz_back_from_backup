export interface IPositions {
    id: number;
    name: string;
}

export interface IPositionsResponse<T> {
    success: boolean;
    positions: T[];
}

