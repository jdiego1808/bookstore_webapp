import {
    Container,
    Paper,
    Typography,
    Grid,
    makeStyles,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardHeader,
    Chip
  } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from '../../Context/AuthContext'
import "./styles.css"
  
const useStyles = makeStyles((theme) => ({
    info: {
        marginTop: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    image: {
        maxWidth: "100%"
    },
    title: {
        marginLeft: "15px"
    },
    break: {
        width: "100%",
        color: "grey",
        opacity: "0.4",
        marginBottom: "0"
    },
    list: {
        padding: "10px"
    },
    heading: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: "33.33%",
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(17),
        color: theme.palette.text.secondary
    },
    items: {
        display: "flex",
        flexDirection: "column"
    },
    root: {
      marginTop: "80px"
    },
}));

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
});
  
export default function App() {
    const classes = useStyles()
    const user = useAuth()
    
    const [quote, setQuote] = useState({})
    const [expanded, setExpanded] = useState("")
  
    const handleChange = (panel) => (event, expanded) => {
      setExpanded(expanded ? panel : "")
    };
  
    useEffect(() => {
      axios.get("https://type.fit/api/quotes").then((res) => {
        setQuote(res.data[Math.floor(Math.random() * res.data.length)]);
      });
    }, [])
  
    return (
      <Container maxWidth="md" className={classes.root}>
        <Paper className="effect effect-c" elevation={3}>
          <Typography className="effect__heading">“{quote.text}”</Typography>
          <Typography className="effect__subheading">
            __ {quote.author ? quote.author : "Anonymous"} __
          </Typography>
        </Paper>
        <br />
        <Paper elevation={3}>
          <Grid container>
            <Grid item xs={4}>
              <img
                src="https://icon-library.com/images/jd-17-512_63749.png"
                className={classes.image}
                alt="profile icon"
              />
            </Grid>
            <Grid item xs={8} className={classes.info}>
              <Typography variant="h6">
                <b>Name:</b> {user.name}
              </Typography>
              <Typography variant="h6">
                <b>Email:</b> {user.email}
              </Typography>
            </Grid>
            <hr className={classes.break} />
            <Grid item xs={12} className={classes.list}>
              <Typography variant="h6">Transaction History</Typography>

              {user.transactions.length>0 ?
                user.transactions.map((tran) => {
                    const d = new Date(tran.date)
                    const date =`${d.getUTCMonth() + 1}/${ d.getUTCDate()}/${d.getUTCFullYear()}`
    
                    return (
                    <Accordion
                        expanded={expanded === tran.date}
                        onChange={handleChange(tran.date)}
                        key={tran.date}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{date}</Typography>
                        <Typography className={classes.secondaryHeading}>
                            {tran.status}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.items}>
                        {tran.items.map((item) => (
                            <Card key={item.bookId}>
                            <CardHeader
                                title={item.title}
                                titleTypographyProps={{ variant: "subtitle1" }}
                                subheader={`Quantity: ${item.quantity}`}
                                subheaderTypographyProps={{ variant: "caption" }}
                                action={<Chip label={formatter.format(item.price)} />}
                            />
                            </Card>
                        ))}
                        <br />
                        <Typography variant="subtitle1">{`Total: ${formatter.format(
                            tran.totalPrice
                        )}`}</Typography>
                        </AccordionDetails>
                    </Accordion>
                    )
                    })
                : <Typography variant="caption">You have no transaction yet</Typography>
              }
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
  