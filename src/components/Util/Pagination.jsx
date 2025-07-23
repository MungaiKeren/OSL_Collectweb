import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Box, IconButton, Button, useTheme } from "@mui/material";

const Pagination = ({ totalItems, currentPage, onPageChange }) => {
  const theme = useTheme();
  var totalPages = Math.floor(totalItems / 12);
  if (totalPages == 0) {
    totalPages = 1;
  }
  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(currentPage - halfVisiblePages, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mt: 2,
        flexWrap: "wrap",
        textAlign: "center",
        justifyContent: "center"
      }}
    >
      <IconButton
        onClick={() => {
          if (currentPage + 1 > 1) {
            onPageChange(currentPage - 1);
          }
        }}
        color="primary"
        disabled={currentPage === 0}
        size="small"
        sx={{ border: `1px solid ${theme.palette.grey[300]}` }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </IconButton>
      {currentPage > 5 && (
        <Button
          onClick={() => handlePageChange(0)}
          variant="outlined"
          color="secondary"
          size="small"
        >
          1
        </Button>
      )}
      {currentPage + 1 > 5 && (
        <Button
          onClick={() => {
            if (currentPage + 1 > 5) {
              onPageChange(currentPage + 1 - 5);
            }
          }}
          variant="text"
          color="secondary"
          size="small"
          sx={{ minWidth: 32 }}
        >
          ...
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber - 1)}
          variant={pageNumber === currentPage + 1 ? "contained" : "outlined"}
          color={pageNumber === currentPage + 1 ? "secondary" : "primary"}
          size="small"
          sx={{
            fontWeight: pageNumber === currentPage + 1 ? 700 : 400,
            minWidth: 32,
            background:
              pageNumber === currentPage + 1
                ? theme.palette.secondary.main
                : undefined,
            color:
              pageNumber === currentPage + 1
                ? theme.palette.background.paper
                : undefined,
            borderColor: theme.palette.grey[300],
          }}
        >
          {pageNumber}
        </Button>
      ))}
      {pageNumbers.length === 5 && (
        <Button
          onClick={() => {
            if (currentPage + 1 < totalPages - 5) {
              onPageChange(currentPage + 5);
            }
          }}
          variant="text"
          color="secondary"
          size="small"
          sx={{ minWidth: 32 }}
        >
          ...
        </Button>
      )}
      {pageNumbers.length === 5 && (
        <Button
          onClick={() => handlePageChange(totalPages)}
          variant="outlined"
          color="secondary"
          size="small"
        >
          {totalPages}
        </Button>
      )}
      <IconButton
        onClick={() => {
          if (currentPage + 1 < totalPages) {
            onPageChange(currentPage + 1);
          }
        }}
        color="primary"
        disabled={currentPage + 1 >= totalPages}
        size="small"
        sx={{ border: `1px solid ${theme.palette.grey[300]}` }}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </IconButton>
    </Box>
  );
};

export default Pagination;
