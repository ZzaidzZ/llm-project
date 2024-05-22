import React, { useEffect, useRef } from 'react';
import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from '../SearchBar/SearchBar';
import logo from './backtick-logo.png';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: '#262626',
    padding: '15px',
    boxShadow: '0px 4px 3px rgba(0,0,0,0.3)',
    // Fixed Heade
    // Flex Box
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: '4rem',
  },
  logoLink: {
    lineHeight: 0,
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  info: {
    padding: '5px',
    height: '.75rem',
    fontSize: '.75rem',
  },
}));


export default function Header(props) {
  const { setSearchTerm, existingTerm, returnRef, current, total,toggleUploadState } = props;
  // Header.js handles title bar and the search box
  const style = useStyles();
  const titleRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    // Send the refs up on component mount
    if (
      titleRef &&
      titleRef.current &&
      !titleRef.current.classList.contains('received')
    ) {
      returnRef(titleRef.current, 'title');
    }
    if (
      logoRef &&
      logoRef.current &&
      !logoRef.current.classList.contains('received')
    ) {
      returnRef(logoRef.current, 'logo');
    }
  }, [titleRef, logoRef, returnRef]);

  return (
    <div className={style.header}>
      <div className={style.title} ref={titleRef}>
        <Link href="/" color="textPrimary" underline="none">
          Fyp Search Engine
        </Link>
      </div>
      <div className={style.search}>
        <Link
          className={style.logoLink}
          href="/"
          color="textPrimary"
          underline="none"
        >
          <img src={logo} alt="Logo" ref={logoRef} />
        </Link>
        <SearchBar setSearchTerm={setSearchTerm} existingTerm={existingTerm} />
        <button
        onClick={()=>{toggleUploadState()}}
         style={{
    marginLeft: "50px",
    backgroundColor: "grey",
    color: "white",
    cursor: "pointer" ,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "15px"  // Add this line to make the button rounded
}}>
    Add your own FYP
</button>

      </div>
      
    </div>
  );
}
