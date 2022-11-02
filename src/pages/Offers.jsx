import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(null);

  const params = useParams();

  //We use useEffect cause we can immediately fetch the listing once the page loads
  useEffect(() => {
    const fetchListings = async () => {
      try {
        //Get reference
        //listingsRef is going to be a reference to the collection, not the document like we were doing before.
        const listingsRef = collection(db, 'listings');

        //create a query
        const q = query(
          listingsRef,
          //We get the rent or sales from params before attached to the route path..see App.js. Once we click on a catergory form explore page..either rent or sales will render on the App /:categoryName
          where('offer', '==', true), //This pages has dicounted listing so we want offers to be true. (...see firestore listings data)
          //desc..means in descending order.
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        //Execute the query (where we use the Get Docs function and that takes in the query. So that's going to get the documents for that specific query.)
        const querySnap = await getDocs(q);

        const listings = [];

        querySnap.forEach(doc => {
          //noticed the doc.data does not hav id so that's why we created an id for each listing
          //pushing the data into the empty array we created above
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };
    fetchListings();
  }, []);
  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map(listing => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}

export default Offers;
