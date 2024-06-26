import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Autosuggest from 'react-autosuggest';
import { Box, Avatar, Menu, MenuItem, IconButton, Typography, Tooltip } from '@mui/material';
import prendasRopaData from "../assets/PrendasRopa.js";
import coloresData from "../assets/Colores.js";
import webLogo from "../assets/ClotheHubLogo.png";
import PersonIcon from '@mui/icons-material/Person';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import axios from 'axios';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';

const theme = {
  container: 'my-container',
  input: 'ui-input',
  suggestionsContainer: 'my-suggestions-container',
  suggestion: 'my-suggestion',
  suggestionHighlighted: 'my-suggestion--highlighted',
};

function AppNavbar({ isLoggedIn, setIsLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const prendasRopa = prendasRopaData.split(", ");
  const colores = coloresData.split(", ");

  const keywords = ['hombre', 'mujer', 'niño', 'niña', 'man', 'woman', 'boy', 'girl'];
  const allSuggestions = [...prendasRopa, ...colores, ...keywords];

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const response = await axios.get("http://localhost/proyectoDaw/public/api/getUser", {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const getSuggestions = value => {
    const inputValue = normalizeString(value).trim();
    const inputLength = inputValue.length;

    if (inputLength < 3) {
      return [];
    }

    const normalizedInput = inputValue.split(' ').map(normalizeString);

    let suggestions = [];
    const startsWithKeyword = keywords.some(keyword => normalizedInput[0] === keyword);

    if (startsWithKeyword) {
      suggestions = allSuggestions
        .filter(sug => !keywords.includes(normalizeString(sug)))
        .filter(sug => normalizeString(sug).includes(normalizedInput[0]))
        .filter(sug => sug.split(' ').length <= 3);
    } else {
      if (normalizedInput.length === 2) {
        const [item, color] = normalizedInput;
        suggestions = prendasRopa
          .filter(prenda => normalizeString(prenda).includes(item))
          .flatMap(prenda => colores
            .filter(col => normalizeString(col).includes(color))
            .map(col => `${prenda} ${col}`));

        const colorFirstSuggestions = colores
          .filter(col => normalizeString(col).includes(item))
          .flatMap(col => prendasRopa
            .filter(prenda => normalizeString(prenda).includes(color))
            .map(prenda => `${col} ${prenda}`));

        suggestions = suggestions.concat(colorFirstSuggestions);
      }

      if (normalizedInput.length === 1) {
        const normalizedValue = normalizedInput[0];
        suggestions = allSuggestions
          .filter(sug => normalizeString(sug).includes(normalizedValue))
          .filter(sug => sug.split(' ').length <= 3);
      }

      suggestions = suggestions.map(suggestion =>
        keywords.filter(keyword => !suggestion.includes(keyword)).map(keyword => `${suggestion} ${keyword}`)
      ).flat();
    }

    return suggestions
      .slice(0, 10)
      .sort((a, b) => {
        const isAInSpanish = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(a);
        const isBInSpanish = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(b);
        if (isAInSpanish && !isBInSpanish) return -1;
        if (!isAInSpanish && isBInSpanish) return 1;
        return 0;
      });
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = (suggestion, { query }) => {
    const parts = suggestion.split(new RegExp(`(${normalizeString(query)})`, 'gi'));
    return (
      <div>
        {parts.map((part, index) =>
          normalizeString(part) === normalizeString(query) ? <strong key={index}>{part}</strong> : part
        )}
      </div>
    );
  };

  const onChange = (event, { newValue }) => {
    setSearchQuery(newValue);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setSearchQuery(suggestion); // Update the input value with the selected suggestion
    handleSearch(suggestion);
  };

  const handleSearch = (query) => {
    const finalQuery = query || (suggestions.length > 0 ? suggestions[0] : searchQuery);
    if (finalQuery.trim() === "") {
      toast.warn("Debes escribir algo antes de buscar");
    } else {
      navigate(`/Clothes?searchQuery=${finalQuery}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim() === "") {
        toast.warn("Debes escribir algo antes de buscar");
        return;
      }
      const normalizedInput = normalizeString(searchQuery).split(' ').map(word => word.trim());
      const isInSuggestions = normalizedInput.some(word => suggestions.some(suggestion => normalizeString(suggestion).includes(word)));

      const isValidSearch = normalizedInput.some(word => keywords.includes(word));

      if (!isInSuggestions && !isValidSearch) {
        navigate('/ErrorPage');
      } else {
        const finalQuery = suggestions.length > 0 ? suggestions[0] : searchQuery;
        setSearchQuery(finalQuery);
        handleSearch(finalQuery);
      }
    }
  };

  const inputProps = {
    placeholder: 'Buscar ropa...',
    value: searchQuery,
    onChange: onChange,
    onKeyDown: handleKeyPress,
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/Dashboard');
  };

  const handleUpgrade = () => {
    handleClose();
    navigate('/Subscribe');
  };

  return (
    <nav className="w-full mb-2">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={webLogo} className="w-20" alt="Web Logo" />
          <span className="self-center text-2xl font-semibold text-black grayspace-nowrap">ClotheHub</span>
        </Link>

        <div className="relative text-gray-600 focus-within:text-gray-400 mb-4 md:mb-0">
          <div className="ui-input-container">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={onSuggestionSelected}
              theme={theme}
            />
            <div className="ui-input-underline"></div>
            <div className="ui-input-highlight"></div>
            <div className="ui-input-icon" onClick={() => handleSearch(searchQuery)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="black"
                  d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                ></path>
              </svg>
            </div>
          </div>
          {isLoggedIn && (
            <div className="divGenerarOutfit mt-5">
              <NavLink to="/GeneradorOutfits" className="text-red-700">
                <button className="btn">
                  <svg height="16" width="16" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
                    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                  </svg>
                  <span className="text">Generador de Outfits</span>
                </button>
              </NavLink>
            </div>
          )}
        </div>

        <div className="flex" id="navbar-default">
          <ul className="font-medium flex flex-col md:flex-row p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            {isLoggedIn ? (
              <>
                <li>
                  <NavLink to="/ShowOutfits" className={({ isActive }) =>
                    isActive ? 'text-red-700 rounded' : 'text-gray rounded hover:text-red-900'
                  }>
                    <LocalFireDepartmentIcon></LocalFireDepartmentIcon>Top Outfits
                  </NavLink>

                  <Tooltip title="Mi Cuenta">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar src={'http://localhost/proyectoDaw/public/storage/profile_images/'+user?.profile_image} alt="Imagen de Usuario" sx={{ width: 50, height: 50 }}/>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={handleProfile}>
                      <PersonIcon />&nbsp;&nbsp;Perfil
                    </MenuItem>

                    <MenuItem onClick={handleUpgrade}>
                      <AddTaskOutlinedIcon />&nbsp;&nbsp;Mejorar Cuenta
                    </MenuItem>
                  </Menu>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/Login" className={({ isActive }) =>
                    isActive ? 'py-2 px-3 text-red-700 rounded' : 'py-2 px-3 text-gray rounded hover:text-red-900'
                  }>
                    Iniciar Sesión
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Register" className={({ isActive }) =>
                    isActive ? 'py-2 px-3 text-red-700 rounded' : 'py-2 px-3 text-gray rounded hover:text-red-900'
                  }>
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
