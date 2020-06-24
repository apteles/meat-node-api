const users = [
  {id: "1",name: 'foo', email: 'foo@gmail.com'},
  {id: "2",name: 'bar', email: 'bar@gmail.com'},
];

export default class User{
  
  static findAll(): Promise<any[]>{
    return Promise.resolve(users)
  }

  static findById(id: string): Promise<any[]>{
    return Promise.resolve(users.filter(v => v.id === id))
  }
}