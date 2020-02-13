import './App.css';
import React from 'react';
import { useQuery} from '@apollo/react-hooks';
import gql from "graphql-tag";
import 'bootstrap/dist/css/bootstrap.min.css';

//Define our query
const kysely = gql`
{
  plan(
    fromPlace: "Pohjoinen Rautatienkatu, Helsinki::60.169396, 24.925857"
    toPlace: "Espoon keskus, Espoo::60.205135,24.656365"
    numItineraries: 5) {
    itineraries {
      walkDistance
      legs {
        startTime
        endTime
        mode
        duration
        distance
        trip {
          departureStoptime {
            scheduledDeparture
          }
          arrivalStoptime {
            scheduledArrival
          }
          routeShortName
          tripHeadsign
        }
      }
    }
  }
}`;

// Seconds to minutes
function toMin(a) {

  var one = Math.floor(a % 3600 / 60);


  return one;


}

//Meters to kilometers
function kmTotal (b) {
  var total = Math.round(b / 100) / 10;

  return total;
}

// What we return to the DOM renderer
function App() {

const { data , loading, error} = useQuery(kysely);

if (loading) return <div class="lds-dual-ring"></div>;
if (error) return <p>Something went wrong : {error.message}</p>;

console.log(data);

return (
  <React.Fragment>
    {data && data.plan && data.plan.itineraries && data.plan.itineraries.map((itineraries, indx) => ( 
      <div key = {indx}>
        <h2>Total amount to walk during trip: {kmTotal(itineraries.walkDistance)}km</h2>
        <div>{itineraries.legs.mode}</div>
          <div>
            {itineraries.legs.map((i, indeksi) => ( //routeShortName is null? or unidentified if .trip is added after legs.
              <div key = {indeksi}>
              <div> {i.mode} </div>
              <div> {kmTotal(i.distance)} km</div>
              <p>{toMin(i.duration)} minutes</p>
              <p>{i.trip.routeShortName}</p>
              </div> 
            ))}
            <div>
            </div>
          </div>
      </div>
    ))}
  </React.Fragment>
  );
}

export default App;
