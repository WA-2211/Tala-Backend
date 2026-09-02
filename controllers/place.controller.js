const Place = require('../models/Place')
const User = require('../models/User')
const Visit = require('../models/Visit')

function filterPlace(query){
    const {category, priceRange, ratingMin} = query

    const filter = {}
    if(category) filter.category = category
    if(priceRange) filter['priceRange.category'] = priceRange
    if(ratingMin) filter.ratingAvg = {$gte: Number(ratingMin)}

    return filter
}

async function recommendPlace(req, res){
    try {
        //visit history
        const visitHistory = await Visit.find({user: req.user._id}).populate('place')

        const categoryVisits = {} //lookup, how many visits for that category
        const lastVisits = {} //lookup, date of visit for place n
        const coolDownPlaces = [] //list, $nin all places excluding places in cooldown



        for(let onePlaceHistory of visitHistory){
            if(onePlaceHistory && onePlaceHistory.place){

                const category = onePlaceHistory.place.category
                if(categoryVisits[category]){
                    categoryVisits[category] = categoryVisits[category]  + 1

                } else {
                    categoryVisits[category] = 1
                }

                if(onePlaceHistory.coolDownUntil > new Date()){
                    coolDownPlaces.push(onePlaceHistory.place._id)

                }

                const onePlace = onePlaceHistory.place._id
                if(!lastVisits[onePlace] || onePlaceHistory.visitedAt > lastVisits[onePlace]){
                    lastVisits[onePlace] = onePlaceHistory.visitedAt 
                }
            }
            
        }

        //calc highest visit
        const highestVisit = Math.max(... Object.values(categoryVisits))

        //get all places excluding cooldown places
        const placesToRecommend = await Place.find({
            _id: {$nin: coolDownPlaces}
        
        })

        //calculate recommendation scoring
        function calculateScore(place){
            let score = 0
            //never visited
            if(!lastVisits[place._id]){
                score += 50
            }
            //visited, but its been a while
            else{
                const timeDifference = new Date() - lastVisits[place._id]
                const days = timeDifference /( 1000 * 60 * 60 * 24)
                const daysDiff = Math.min(days, 25)
                score += daysDiff
            }
            //under-explored category
                const diff = (categoryVisits[place.category] || 0) / highestVisit
                const sub = 1 - diff 
                score += sub * 30
            
            //highest rating places
            score += place.ratingAvg * 4
            return score
        }

        const placesScored = placesToRecommend.map(place =>{
          const score = calculateScore(place)
            const combinePlaceWithScore = {place, score}
            return combinePlaceWithScore
        }) 

        const topPicks = placesScored.sort((a, b)=> b.score - a.score).slice(0,2)
        res.status(200).json(topPicks)

    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}

async function getAllPlaces(req, res) {
    try {
        
        const allPlaces = await Place.find(filterPlace(req.query))
        res.status(200).json(allPlaces)

    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}

async function createPlace(req, res){
    try {
        const {name, category, priceRange, description, ratingAvg, tags, location} = req.body
        const createdPlace = await Place.create({
            name,
            description,
            category,
            priceRange,
            ratingAvg,
            tags,
            location
    })

    res.status(201).json(createdPlace)
    }
    
    catch (err) {
            if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
            res.status(500).json({ message: err.message })

    }
}

async function getOnePlace(req, res){
    try {
        const getPlace = await Place.findById(req.params.placeId)
        if(!getPlace){
            return res.status(404).json({message: 'Place not found!'})
        }

        res.status(200).json(getPlace)

    } catch (err) {
            res.status(500).json({ message: err.message })

    }
}

async function updatePlace(req, res){
    try {
        const {name, category, priceRange, description, ratingAvg, tags} = req.body
        const updatedPlace = await Place.findByIdAndUpdate(req.params.placeId,{
            name,
            description,
            category,
            priceRange,
            ratingAvg,
            tags
    }, {new: true})
        if(!updatedPlace){
            return res.status(404).json({message: 'Place not found!'})
        }
        res.status(200).json(updatedPlace)
    } catch (err) {
            if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })

    }
}

async function deletePlace(req, res){
    try {
        const deletedPlace = await Place.findByIdAndDelete(req.params.placeId)
        if(!deletedPlace){
            return res.status(404).json({message: 'Place not found!'})
        }
        res.status(204).json(deletedPlace)

    } catch (err) {
        res.status(500).json({ message: err.message })

    }

}

async function getNearMePlaces(req, res){
    try {
        const {lat, long} = req.query
        if(!long || !lat){
            return res.status(400).json({message: 'Longitude and Latitude are required!'})
        }

        const nearMePlaces = await Place.aggregate([
            {
                $geoNear:{
                    near: {
                        type: 'Point',
                        coordinates: [Number(long), Number(lat)]
                    },
                    key: 'location',
                    distanceField: 'distance',
                    maxDistance:2000,
                    spherical: true,
                    query: filterPlace(req.query)
                }
            }
        ])

        res.status(200).json(nearMePlaces)
    } catch (err) {
        res.status(500).json({ message: err.message })
  
    }
}



module.exports = {
    getAllPlaces,
    createPlace,
    getOnePlace,
    updatePlace,
    deletePlace,
    recommendPlace,
    getNearMePlaces
}