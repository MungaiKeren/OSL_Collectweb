import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Pagination = ({ totalItems, currentPage, onPageChange }) => {
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
    <div className="cpagination">
      <FontAwesomeIcon
        icon={faArrowLeft}
        onClick={() => {
          if (currentPage + 1 > 1) {
            onPageChange(currentPage - 1);
          }
        }}
        className="fa fa-arrow-left"
      />
      {currentPage > 5 && (
        <h5
          onClick={() => {
            handlePageChange(0);
          }}
        >
          {1}
        </h5>
      )}
      {currentPage + 1 > 5 && (
        <h5
          onClick={() => {
            if (currentPage + 1 > 5) {
              onPageChange(currentPage + 1 - 5);
            }
          }}
        >
          ...
        </h5>
      )}
      {pageNumbers.map((pageNumber) => (
        <h5
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber - 1)}
          className={`page-item ${
            pageNumber === currentPage + 1 ? "active" : ""
          }`}
        >
          {pageNumber}
        </h5>
      ))}
      {pageNumbers.length === 5 && (
        <h5
          onClick={() => {
            if (currentPage + 1 < totalPages - 5) {
              onPageChange(currentPage + 5);
            }
          }}
        >
          ...
        </h5>
      )}
      {pageNumbers.length === 5 && (
        <h5
          onClick={() => {
            handlePageChange(totalPages);
          }}
        >
          {totalPages}
        </h5>
      )}
      <FontAwesomeIcon
        icon={faArrowRight}
        onClick={() => {
          if (currentPage + 1 < totalPages) {
            onPageChange(currentPage + 1);
          }
        }}
      />
    </div>
  );
};

export default Pagination;
