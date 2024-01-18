export default interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    find(id: number): Promise<T | null>;
    create(t: T): Promise<T>;
    update(id: number, t: T): Promise<T>;
    delete(id: number): Promise<void>;
}