import {
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    InputAdornment
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState, useRef } from "react";
  
const InsertBookForm = ({ open, handleClose, handleInsert }) => {
    const defaultUrl = "https://icons-for-free.com/iconfiles/png/512/mountains+photo+photos+placeholder+sun+icon-1320165661388177228.png";
  
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [imgUrl, setImgUrl] = useState(defaultUrl);
    const [titleError, setTitleError] = useState(false);
    const [isbnError, setIsbnError] = useState(false);
    const [pageCountError, setPageCountError] = useState(false);
    const [stDesError, setStDesError] = useState(false);
    const [lgDesError, setLgDesError] = useState(false);
    const [thumbError, setThumbError] = useState(false);
    const [authorsError, setAuthorsError] = useState(false);
    const [catesError, setCatesError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [qtyError, setQtyError] = useState(false);
    const [error, setError] = useState("");
  
    const titleRef = useRef("");
    const isbnRef = useRef("");
    const pageCountRef = useRef("");
    const shortDescriptionRef = useRef("");
    const longDescriptionRef = useRef("");
    const authorsRef = useRef("");
    const categoriesRef = useRef("");
    const priceRef = useRef("");
    const quantityRef = useRef("");
  
    const handleSubmit = (e) => {
        const regex = /([a-zA-Z]*((['. -][a-zA-Z])?[a-zA-Z]*))*/g;
        const authors = authorsRef.current.value.match(regex);
        const cates = categoriesRef.current.value.match(regex);
    
        const book = {
            title: titleRef.current.value,
            isbn: isbnRef.current.value,
            pageCount: pageCountRef.current.value,
            thumbnailUrl: thumbnailUrl,
            shortDescription: shortDescriptionRef.current.value,
            longDescription: longDescriptionRef.current.value,
            authors: authors.filter((a) => a).map((a) => a.trim()),
            categories: cates.filter((a) => a).map((a) => a.trim()),
            price: priceRef.current.value,
            quantity: quantityRef.current.value
        };
    
        //console.log(book);
        handleInsert(book)
    };
  
    const handleBlurIsbn = (e) => {
        const regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/gm;
        const value = e.target.value;
        if (!value) {
            setError("");
            setIsbnError(true);
            return;
        }
        if (!regex.test(value)) {
            setError("ISBN number is invalid.");
            setIsbnError(true);
            return;
        }
        setError("");
        setIsbnError(false);
    };
  
    return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-insert-book" fullWidth maxWidth="lg">
        <DialogTitle id="form-title">Add new book</DialogTitle>
        <DialogContent>
            <DialogContentText>
                To insert a new book, please enter all fields below.
            </DialogContentText>
  
          <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
            <Grid item xs>
                <Grid item xs>{error !== "" && <Alert severity="error">{error}</Alert>}</Grid>
                <Grid item xs>
                    <TextField
                    error={titleError}
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    onBlur={(e) => !e.target.value ? setTitleError(true) : setTitleError(false)}
                    inputRef={titleRef}
                    fullWidth
                    required
                    />
                </Grid>
                <Grid item xs container spacing={2}>
                    <Grid item xs>
                        <TextField
                            margin="dense"
                            id="isbn"
                            error={isbnError}
                            onBlur={handleBlurIsbn}
                            inputRef={isbnRef}
                            label="Isbn"
                            type="text"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            margin="dense"
                            id="pageCount"
                            inputRef={pageCountRef}
                            error={pageCountError}
                            onBlur={(e) =>
                            !e.target.value
                                ? setPageCountError(true)
                                : setPageCountError(false)
                            }
                            label="Page count"
                            InputProps={{ inputProps: { min: 0 } }}
                            type="number"
                            fullWidth
                            required
                        />
                    </Grid>
                 </Grid>
                <Grid item xs>
                    <TextField
                        margin="dense"
                        id="thumbnailUrl"
                        label="Image URL"
                        type="url"
                        error={thumbError}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        onKeyUp={(e) => setImgUrl(thumbnailUrl)}
                        onBlur={(e) =>
                            !e.target.value ? setThumbError(true) : setThumbError(false)
                        }
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        margin="dense"
                        id="shortDescription"
                        label="Short Description"
                        type="text"
                        error={stDesError}
                        inputRef={shortDescriptionRef}
                        onBlur={(e) => !e.target.value ? setStDesError(true) : setStDesError(false) }
                        rows={4}
                        fullWidth
                        multiline
                        required
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        margin="dense"
                        id="longDescription"
                        label="Long Description"
                        type="text"
                        error={lgDesError}
                        inputRef={longDescriptionRef}
                        onBlur={(e) => !e.target.value ? setLgDesError(true) : setLgDesError(false) }
                        rows={8}
                        fullWidth
                        multiline
                        required
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        margin="dense"
                        id="authors"
                        label="Authors"
                        error={authorsError}
                        onBlur={(e) => !e.target.value ? setAuthorsError(true) : setAuthorsError(false) }
                        type="text"
                        helperText="Separating each name by comma"
                        inputRef={authorsRef}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        margin="dense"
                        id="categories"
                        label="Categories"
                        type="text"
                        helperText="Separating each category by comma"
                        error={catesError}
                        onBlur={(e) => !e.target.value ? setCatesError(true) : setCatesError(false)}
                        inputRef={categoriesRef}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs container spacing={2}>
                    <Grid item xs>
                        <TextField
                            margin="dense"
                            id="price"
                            label="Price"
                            type="number"
                            error={priceError}
                            onBlur={(e) => !e.target.value ? setPriceError(true) : setPriceError(false) }
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                            ),
                            inputProps: { min: 0 }
                            }}
                            inputRef={priceRef}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            margin="dense"
                            id="quantity"
                            label="Quantity"
                            type="number"
                            error={qtyError}
                            onBlur={(e) => !e.target.value ? setQtyError(true) : setQtyError(false) }
                            InputProps={{ inputProps: { min: 0 } }}
                            inputRef={quantityRef}
                            fullWidth
                            required
                        />
                    </Grid>
              </Grid>
            </Grid>  
            <Grid item xs align="center">
                <img
                    src={imgUrl}
                    onError={(e) => {
                    setImgUrl(defaultUrl);
                    setError("Invalid image url.");
                    }}
                    onLoad={e => imgUrl===thumbnailUrl && setError('') }
                    alt="book"
                    width="300px"
                />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                color="primary"
                disabled={
                    titleError ||
                    isbnError ||
                    pageCountError ||
                    stDesError ||
                    lgDesError ||
                    thumbError ||
                    priceError ||
                    qtyError ||
                    authorsError ||
                    catesError
                }
            >
                Save
            </Button>
        </DialogActions>
    </Dialog>
    );
  };
  
  export default InsertBookForm;
  