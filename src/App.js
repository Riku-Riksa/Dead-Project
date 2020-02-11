import './App.css';
import React from 'react';
import { useQuery} from '@apollo/react-hooks';
import gql from "graphql-tag";
import 'bootstrap/dist/css/bootstrap.min.css';


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

function App() {

const { data , loading, error} = useQuery(kysely);

if (loading) return <p>loading</p>;
if (error) return <p>error lulz {error.message}</p>;

console.log(data);

return (
  <React.Fragment>
    {data && data.plan && data.plan.itineraries  && data.plan.itineraries.map((itineraries, indx) => ( //I have no idea what this is doing
      <div key = {indx}>
        <h2>Total amount to walk during trip: {kmTotal(itineraries.walkDistance)}km</h2>
          <div>
            {itineraries.legs && itineraries.legs.map((i, indeksi) => {
              return <div key = {indeksi}>{i.mode}
              <p>{toMin(i.duration)} minutes</p>
              </div>
            })}
            {(itineraries.legs.trip || []).map((p, indos) => ( //the first trip is null so we need something to fix that! Also now its not showing anything :D
              <div key = {indos}>{p.trip.departureStoptime.scheduledDeparture}
              <p>{p.trip.routeShortName} {p.trip.tripHeadsign}</p>
              </div>
            ))}
          </div>
      </div>
    ))}
  </React.Fragment>
  );
}

export default App;
