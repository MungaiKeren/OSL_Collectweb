import {
  faDatabase,
  faEdit,
  faLink,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "../../Styles/toolbuilder.scss";
import active from "../../assets/imgs/active.png";
import inactive from "../../assets/imgs/inactive.png";
import Loading from "../Util/Loading";
import Pagination from "../Util/Pagination";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Stack,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";

export default function ToolBuilder(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [offset, setOffset] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/toolslist/paginated/${offset * 12}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [refresh, offset]);

  function quickSearch(v) {
    setLoading(true);
    fetch(`/api/toolslist/quicksearch/ToolName/${v}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        background: theme.palette.background.paper,
        minHeight: "100vh",
      }}
    >
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem("tsediting");
              window.location.href = "/buildtool/new";
            }}
            sx={{
              fontWeight: 600,
              backgroundColor: "secondary",
              color: "white",
            }}
          >
            + Create Tool
          </Button>
          <TextField
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 2) {
                quickSearch(value);
              }
              if (value.length === 0) {
                setRefresh(!refresh);
              }
            }}
            type="text"
            size="small"
            placeholder="Search tools..."
            sx={{ width: { xs: "100%", sm: 300 } }}
            InputProps={{
              endAdornment: (
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ color: theme.palette.secondary.main }}
                />
              ),
            }}
          />
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }} elevation={1}>
        <Typography
          variant="h6"
          fontWeight={600}
          color={theme.palette.primary.main}
          mb={2}
        >
          Data Collection Tools
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          {data &&
            data?.data?.length > 0 &&
            data?.data?.map((item, i) => (
              <Grid size={{ xs: 12 }} key={i}>
                <Item item={item} index={i + offset * 12} />
              </Grid>
            ))}
        </Grid>
        <Pagination
          totalItems={data?.total}
          currentPage={offset}
          onPageChange={(e) => {
            setOffset(e);
          }}
        />
      </Paper>
      {loading && <Loading />}
    </Box>
  );
}

const Item = (props) => {
  const theme = useTheme();
  const date = new Date(props.item.createdAt).toLocaleString("en-US");

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        gap: 2,
        borderRadius: 2,
        background: theme.palette.background.paper,
        boxShadow: "0 2px 8px 0 #00000010",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 4px 16px 0 #00000020",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mr: 2,
        }}
      >
        <img
          src={props.item.Status === "Active" ? active : inactive}
          alt={props.item.Status}
          style={{ width: 36, height: 36, marginBottom: 4 }}
        />
        <Typography
          variant="caption"
          color={
            props.item.Status === "Active"
              ? theme.palette.success.main
              : theme.palette.error.main
          }
        >
          {props.item.Status}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Typography variant="subtitle2" color={theme.palette.text.secondary}>
            #{props.index + 1}
          </Typography>
          <Typography
            variant="h6"
            color={theme.palette.primary.main}
            fontWeight={600}
          >
            {props.item.ToolName}
          </Typography>
        </Stack>
        <Typography variant="caption" color={theme.palette.grey[400]}>
          {date}
        </Typography>
      </Box>
      <Box flex={1}>
        <Stack direction="column" spacing={2} mb={1}>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            <b>Data table:</b> {props.item.DataTableName}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            <b>County:</b> {props.item.County}
          </Typography>
        </Stack>
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={() => {
            window.location.href =
              "/buildtool/data/" + props.item.DataTableName;
          }}
          color="primary"
          size="small"
        >
          <FontAwesomeIcon icon={faDatabase} />
        </IconButton>
        <IconButton
          onClick={() => {
            window.location.href = "/buildtool/update/" + props.item.ID;
          }}
          color="secondary"
          size="small"
        >
          <FontAwesomeIcon icon={faEdit} />
        </IconButton>
        <IconButton
          onClick={() => {
            window.open(`/questionnaire/${props.item.DataTableName}`, "_blank");
          }}
          color="info"
          size="small"
        >
          <FontAwesomeIcon icon={faLink} />
        </IconButton>
      </Stack>
    </Paper>
  );
};
