package com.moveinsync.scheduler.api;
import com.moveinsync.scheduler.api.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.NoSuchElementException;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(NoSuchElementException.class) ResponseEntity<ApiError> notFound(Exception e,HttpServletRequest r){return error(404,"NOT_FOUND","Resource not found",r);}
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ApiError> badRequest(Exception e,HttpServletRequest r){return error(400,"INVALID_REQUEST",e.getMessage(),r);}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> validation(Exception e,HttpServletRequest r){return error(400,"VALIDATION_ERROR","Request validation failed",r);}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> internal(Exception e,HttpServletRequest r){return error(500,"INTERNAL_ERROR","An unexpected error occurred",r);}
 private ResponseEntity<ApiError> error(int status,String code,String message,HttpServletRequest r){
  return ResponseEntity.status(status).body(new ApiError(Instant.now(),status,code,message,r.getRequestURI()));
 }
}
