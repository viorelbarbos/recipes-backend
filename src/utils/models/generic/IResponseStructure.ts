export default interface IResponseStructure {
    success: boolean;
    message: string;
    // eslint-disable-next-line
    data?: any;
    // eslint-disable-next-line
    error?: any;
}
