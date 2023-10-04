import {ApolloServer, gql, UserInputError} from 'apollo-server';
import {v1 as uuid} from "uuid";

const persons = [
  {
    name: 'Pepe',
    phone: '034-1234567',
    street: 'Calle Frontend',
    city: 'Barcelona',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: 'Antía',
    phone: '044-123456',
    street: 'Avenida Fullstack',
    city: 'Cuntis',
    id: '6b43320-2836-14v5-bc56-7l82xba54c221'
  },
  {
    name: 'Romain',
    street: 'Pasaje Testing',
    city: 'Marsella',
    id: '7y694342-2226-2abn-5fgc-4rt45a54c23d'
  },
]

//especificamos el tipo de datos que usaremos, encapsulando en una variable el gql importado con la especificación entre `` (funciona como un template)
// los datos requeridos obligatoriamente finalizan con "!". También definimos un type query, en este caso son dos peticiones que podremos hacer al servidor, una 
// para contar el número de personas que nos devolverá un número entero (integer), y otra para recuperar datos de todas las personas que nos devolverá un array de personas.
const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String!
    address: Address!
    check: String!
    id: ID!
  }
  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person 
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`
//en resolvers establecemos métodos para resolver las querys que definimos previamente.
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const {name} = args
      return persons.find(person => person.name === name)
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name
        })
      }
      const person = {...args, id: uuid()} //en args tenemos phone, name, streett... con uuid generamos un id aleatorio
      persons.push(person) //para actualizar la base de datos con una nueva persona
      return person
    }
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}

//creamos el servidor de grapql con apollo
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
})

//iniciamos el servidor
server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`)
})