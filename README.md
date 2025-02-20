# afrus-test

## Scripts 
Para ejecutar el seed de la DB y para generar reportes en formato json.
```
npm run seed
npm run report
```

## Tests 
Para ejecutar los integration test de controladores: products, customers y events. 
![image](https://github.com/user-attachments/assets/78b18b31-fd02-41d9-9617-92d8774428bf)
```
npm run test
```

## Endpoints 
### Customers
| Route | Method | Description |
|-------|---------|------------|
| `/api/customers` | `GET` | Get all customers |
| `/api/customers/transactions` | `GET` | Get all customer transactions |

### Events
| Route | Method | Description |
|-------|---------|------------|
| `/api/events` | `POST` | Create customer event |
| `/api/events/customer/:customerId` | `GET` | Get events by customer ID |

### Products
| Route | Method | Description |
|-------|---------|------------|
| `/api/products` | `GET` | Get all products |
| `/api/products` | `POST` | Create product |
| `/api/products/:id` | `DELETE` | Delete product by ID |  
| `/api/products/filter/price-stock` | `GET` | Get filtered products by price and stock |

### Reports
| Route | Method | Description |
|-------|---------|------------|
| `/api/reports/filtered-products` | `GET` | Get filtered products report |
| `/api/reports/transactions` | `GET` | Get transactions report |

## Front
### Customer list 
![image](https://github.com/user-attachments/assets/02e4b6ab-8c20-45a1-91a6-6164400f1956)

### Dashboard 
![image](https://github.com/user-attachments/assets/90c01ff9-b0cd-44e9-a8ed-8bee46d20c99)
![image](https://github.com/user-attachments/assets/05c4407a-c7f2-41b7-ac71-568a07315c57)

### Product list
![image](https://github.com/user-attachments/assets/bd50f6f9-8387-44f7-b9e3-6496e85a026a)

## Mejoras 
* Implementar login con tokens JWT
* Implementar paginación para los principales GET endpoints
* Añadir funcionalidades en el front end como CRUD básico de cada entidad
* Amplicar el test coverage 
