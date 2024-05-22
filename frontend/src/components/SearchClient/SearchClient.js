import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from '../Header/Header';
import UploadHeader from '../UploadHeader/UploadHeader';
import Footer from '../Footer/Footer';
import ResultsContainer from '../ResultsContainer/ResultsContainer';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
  site: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  results: {
    // Grows to fit content
    flex: '1 0 auto',
    paddingBottom: '40px',
  },
  card: {
    opacity: 0,
  },
  content: {
    width: 300,
    minHeight: 230,
  },
  match: {
    fontWeight: 800,
  },
  subtitle: {
    fontSize: '.75rem',
  },
}));

export default function SearchClient({ urlParams, history, returnRef }) {
  // Search.js handles search, endpoint access, and displaying results
  const [uploadState, setUploadState] = useState(false);
  const [searchTerm, setSearchTerm] = useState(urlParams.search);
  const [resultData, setResultData] = useState({ results: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const style = useStyles();

  // === Callout Functions
  async function endpointCallout(term, offset = 0) {
    // Fetch Results
    setLoading(true);
    // console.log(`Callout for term: ${term}`);
    const endpoint = 'https://backtick.tilde.wtf';
    const params = `search?q=${term}&offset=${offset}`;
    // console.log(`${endpoint}/${params}`);
    const res = await axios(`${endpoint}/${params}`);
    // console.log('api response:');
    // console.log(res.data);
    setLoading(false);
    return res.data;
  }

  async function fetchMore(newOffset) {
    const updateCriteria =
      newOffset &&
      newOffset > 0 && // Not the first offset
      newOffset === resultData.results.length && // maxed out the current offset
      resultData.results.length % 30 === 0 && // current results is a multiple of 30
      !loading; // Not already performing a callout

    if (updateCriteria) {
      // console.log('Valid offset request. Fetching more...');
      const data = await endpointCallout(searchTerm, newOffset);
      setResultData((resultData) => ({
        results:
          data.results && data.results.length > 0
            ? [...resultData.results, ...data.results]
            : [...resultData.results],
        query: data.query ? data.query : null,
        offset: data.offset ? parseInt(data.offset) : 0,
        total: data.total ? parseInt(data.total) : 0,
      }));
    } else {
      // console.log('Failed requirements for fetchMore');
    }
  }

  useEffect(() => {
    // == Handle new search term
    if (searchTerm) {
      // console.log(`New search term detected: ${searchTerm}`);
      history.push(`/search=${searchTerm}`);

      setResultData({ results: [] }); // Clear previous search results

      fetchResults();
      async function fetchResults() {
        const data = await endpointCallout(searchTerm);
        setResultData({
          results: data.results && data.results.length > 0 ? data.results : [],
          query: data.query ? data.query : null,
          offset: data.offset ? parseInt(data.offset) : 0,
          total: data.total ? parseInt(data.total) : 0,
        });
      }
    } else {
      // searchTerm was changed to null
      // console.log(`Blank search`);
      history.push('/');

      setResultData({ results: [] }); // Clear previous search results
    }
  }, [searchTerm, history]);
  const toggleUploadState =()=>{
    setUploadState(!uploadState)
  }
  return (<>
    {!uploadState ? (
      <div className={style.site} style={{display:"flex",flexDirection:"column"}}>
        <Header
          setSearchTerm={setSearchTerm}
          existingTerm={searchTerm}
          returnRef={returnRef}
          current={resultData.results.length}
          total={resultData.total}
          toggleUploadState={toggleUploadState}
        />
        <div>Hello</div>
    
      </div>
    ) : <div className={style.site}>
        <UploadHeader
          setSearchTerm={setSearchTerm}
          existingTerm={searchTerm}
          returnRef={returnRef}
          current={resultData.results.length}
          total={resultData.total}
          toggleUploadState={toggleUploadState}
        />
        
      </div>}
    </>
    
  );
}
