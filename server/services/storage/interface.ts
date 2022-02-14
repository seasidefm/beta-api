export interface IServiceBase<T> {
    findOrCreate(...args: any[]): Promise<T>
}