// db.postcodes.updateMany(
//     {},
//     { $set:
//         {location:
//             {type: 'Point', coordinates: [$lat, $long]}
//         }
//     }
// )

// db.postcodes.aggregate(
//     [
//         { "$addFields": {
//                 location: {type: 'Point', coordinates: ["$lat", "$long"]}
//             }},
//         { "$out": "postcodes" }
//     ]
// )

db.postcodes.aggregate(
    [
        { "$addFields": {
                location: ["$lat", "$long"]
            }
        },
        { "$out": "postcodes" }
    ]
)

db.postcodes.createIndex( { "location": "2d" } )
