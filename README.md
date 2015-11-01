# biblos

Application that combines [Sails](http://sailsjs.org) for an rest api and admin pages and an user application made with [angularjs](https://angularjs.org/).

The admin user can add, edit(TODO), remove(TODO) products and see, see details(TODO), erase(TODO) order made by customers.
The client can make an order.

When a client made an order, the admin user will receive a push notification in its Android app (in repo [BiblosAndroid]()).
For push notifications, it are using [Parse](https://www.parse.com/).

##To start using
Set environment settings neeed to start app:
 * appId:app id in parse system
 * httpApiId:http Api id in parse system
 * postgressHost:postress host
 * postgressUser:postress user
 * postgressPass:postress pass
 * postgressDb:postress data base name

Run command: 
>```sails lift```


