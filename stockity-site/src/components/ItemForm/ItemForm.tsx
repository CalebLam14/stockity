import {
  Button,
  ButtonGroup,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Component, ChangeEvent } from "react";
import { config } from "../../config";
import Group from "../../interfaces/Group";
import Item from "../../interfaces/Item";
import ItemParams from "../../interfaces/ItemParams";
import GroupSelectionList from "../GroupSelectionList/GroupSelectionList";

type ItemFormProps = {
  id: number | null;
  onSubmit: (values: ItemParams) => void;
  submissionInProgress: boolean;
};

type ItemFormValues = {
  name: string;
  description: string;
  price: string;
  stock: string;
  group: Group | null;
};

type ItemPropMap<T> = {
  name: T;
  description: T;
  price: T;
  stock: T;
};

type ItemFormState = {
  values: ItemFormValues;
  itemParams: ItemParams;
  dirty: ItemPropMap<boolean>;
  loading: boolean;
};

type ChangeHandler = (
  blurred: boolean
) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;

type ChangeHandlerMap = {
  name: ChangeHandler;
  description: ChangeHandler;
  price: ChangeHandler;
  stock: ChangeHandler;
};

class ItemForm extends Component<ItemFormProps, ItemFormState> {
  constructor(props: ItemFormProps) {
    super(props);
    this.id = props.id;
    this.onSubmit = props.onSubmit;
  }

  id: number | null;
  onSubmit: (values: ItemParams) => void;

  state: ItemFormState = {
    values: {
      name: "",
      description: "",
      price: "0.00",
      stock: "0",
      group: null
    },
    itemParams: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      group: null
    },
    dirty: {
      name: false,
      description: false,
      price: false,
      stock: false
    },
    loading: true
  };

  changeHandlers: ChangeHandlerMap = {
    name: (blurred: boolean) => (e) =>
      this.setState((prevState) => {
        const newState: ItemFormState = { ...prevState };
        const newValue = e.target.value;
        newState.values.name = blurred ? newValue.trim() : newValue;
        newState.dirty.name = true;

        if (blurred) {
          newState.itemParams.name = newValue.trim();
          newState.values.name = newState.itemParams.name;
        }

        return newState;
      }),

    description: (blurred: boolean) => (e) =>
      this.setState((prevState) => {
        const newState: ItemFormState = { ...prevState };
        const newValue = e.target.value;
        newState.values.description = blurred ? newValue.trim() : newValue;
        newState.dirty.description = true;

        if (blurred) {
          newState.itemParams.description = newValue.trim();
          newState.values.description = newState.itemParams.description;
        }

        return newState;
      }),

    price: (blurred: boolean) => (e) =>
      this.setState((prevState) => {
        const newState: ItemFormState = { ...prevState };
        newState.values.price = e.target.value;
        newState.dirty.price = true;

        if (blurred) {
          const newPrice = Math.round(parseFloat(e.target.value) * 100) / 100;

          if (!isNaN(newPrice)) {
            newState.itemParams.price = newPrice;
            newState.values.price = newPrice.toFixed(2);
          } else {
            newState.values.price = newState.itemParams.price.toFixed(2);
          }
        }

        return newState;
      }),

    stock: (blurred: boolean) => (e) =>
      this.setState((prevState) => {
        const newState: ItemFormState = { ...prevState };
        newState.values.stock = e.target.value;
        newState.dirty.stock = true;

        if (blurred) {
          const newStock = parseInt(e.target.value);

          if (!isNaN(newStock)) {
            newState.itemParams.stock = newStock;
            newState.values.stock = newStock.toString();
          } else {
            newState.values.stock = newState.itemParams.stock.toString();
          }
        }

        return newState;
      })
  };

  handleGroupChange = (group: Group | null) => {
    this.setState((prevState) => {
      const newState: ItemFormState = { ...prevState };
      newState.values.group = group;
      newState.itemParams.group = group != null ? group.id : null;
    });
  };

  componentDidMount() {
    const id = this.props.id;
    if (id != null) {
      fetch(config.apiUrl + `/items/${id}`)
        .then((resp) => resp.json())
        .then((respJson) => {
          const itemResp = respJson as Item;

          this.setState((prevState) => {
            const newState: ItemFormState = { ...prevState };
            newState.values = {
              name: itemResp.name,
              description: itemResp.description,
              price: itemResp.price.toFixed(2),
              stock: itemResp.stock.toString(),
              group: itemResp.group
            };
            newState.itemParams = {
              name: itemResp.name,
              description: itemResp.description,
              price: itemResp.price,
              stock: itemResp.stock,
              group: itemResp.group != null ? itemResp.group.id : null
            };
            newState.loading = false;
            return newState;
          });
        });
    } else {
      this.setState((prevState) => {
        const newState: ItemFormState = { ...prevState };
        newState.loading = false;
        return newState;
      });
    }
  }

  render() {
    const loading = this.state.loading;
    const values = this.state.values;
    const params = this.state.itemParams;
    const hasError: ItemPropMap<boolean> = {
      name: values.name.length === 0,
      description: false,
      price: params.price < 0,
      stock: params.stock < 0
    };
    const validForm =
      !hasError.name &&
      !hasError.description &&
      !hasError.price &&
      !hasError.stock;
    const dirty = this.state.dirty;
    const handlers = this.changeHandlers;

    if (loading) {
      return <CircularProgress />;
    }
    return (
      <form>
        <Stack spacing={2} marginBottom={2}>
          <TextField
            label="Product Name"
            variant="outlined"
            required
            fullWidth
            value={this.state.values.name}
            error={hasError.name && dirty.name}
            helperText={
              hasError.name && dirty.name
                ? "Please provide a product name!"
                : null
            }
            onChange={handlers.name(false)}
            onBlur={handlers.name(true)}
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            minRows={2}
            maxRows={5}
            fullWidth
            value={this.state.values.description}
            onChange={handlers.description(false)}
            onBlur={handlers.description(true)}
          />
          <TextField
            label="Price"
            variant="outlined"
            required
            fullWidth
            inputProps={{ inputMode: "decimal" }} // InputBaseComponentProps
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }} // OutlinedInputProps
            error={hasError.price && dirty.price}
            value={this.state.values.price}
            helperText={
              hasError.price && dirty.price
                ? "Please provide the product's price!"
                : null
            }
            onChange={handlers.price(false)}
            onBlur={(e) => {
              console.log("Blur");
              handlers.price(true)(e);
            }}
          />
          <TextField
            label="Stock"
            variant="outlined"
            required
            fullWidth
            inputProps={{ inputMode: "numeric" }}
            error={hasError.stock && dirty.stock}
            value={this.state.values.stock}
            helperText={
              hasError.stock && dirty.stock
                ? "Please provide the product's stock!"
                : null
            }
            onChange={handlers.stock(false)}
            onBlur={handlers.stock(true)}
          />
          <Typography variant="body1">
            <b>Item Group</b>
          </Typography>
          <GroupSelectionList
            selectedGroup={this.state.values.group}
            onSelectionChanged={this.handleGroupChange}
          />
        </Stack>
        <ButtonGroup>
          {this.props.submissionInProgress ? (
            <CircularProgress />
          ) : (
            <Button onClick={() => this.onSubmit(params)} disabled={!validForm}>
              {this.id != null ? "Save" : "Create"}
            </Button>
          )}
        </ButtonGroup>
      </form>
    );
  }
}

export default ItemForm;
