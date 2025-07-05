import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography, IconButton } from '@material-ui/core';
import { HelpOutline, Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  chatButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: '50%',
    width: 56,
    height: 56,
    boxShadow: theme.shadows[4],
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    transition: 'all 0.3s ease',
  },
  chatFrame: {
    width: 360,
    height: 500,
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[6],
    marginBottom: theme.spacing(1),
    display: 'none',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  chatFrameVisible: {
    display: 'block',
    opacity: 1,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const LiveChat = ({ tawkToPropertyId, tawkToWidgetId }) => {
  const classes = useStyles();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Load Tawk.to script
    if (isChatOpen) {
      setIsLoading(true);
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${tawkToPropertyId}/${tawkToWidgetId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      script.onload = () => {
        setIsLoading(false);
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_API.onLoad = function() {
          setIsLoading(false);
        };
      };
      
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isChatOpen, tawkToPropertyId, tawkToWidgetId]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // Reset Tawk.to API when opening chat
      window.Tawk_API = {};
    }
  };

  return (
    <div className={classes.chatContainer}>
      {isChatOpen && (
        <div style={{ position: 'relative' }}>
          {isLoading ? (
            <div className={`${classes.chatFrame} ${classes.chatFrameVisible} ${classes.loadingContainer}`}>
              <CircularProgress />
              <Typography variant="body1" style={{ marginTop: 16 }}>
                Loading chat...
              </Typography>
            </div>
          ) : (
            <iframe
              id="tawkIframe"
              title="Tawk.to Chat"
              className={`${classes.chatFrame} ${classes.chatFrameVisible}`}
              allow="microphone; camera"
            />
          )}
          <IconButton
            className={classes.closeButton}
            onClick={toggleChat}
            size="small"
          >
            <Close />
          </IconButton>
        </div>
      )}
      <IconButton
        className={classes.chatButton}
        onClick={toggleChat}
        aria-label="Live chat"
      >
        {isChatOpen ? <Close /> : <HelpOutline />}
      </IconButton>
    </div>
  );
};

LiveChat.propTypes = {
  tawkToPropertyId: PropTypes.string.isRequired,
  tawkToWidgetId: PropTypes.string.isRequired,
};

export default LiveChat;