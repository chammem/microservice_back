package tn.esprit.profile_service.handler;




import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tn.esprit.profile_service.Exception.OperationNotPermitedException;

import java.util.HashSet;
import java.util.Set;

import static tn.esprit.profile_service.handler.BusinessErrorCode.*;
import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
public class GlobalExceptionHandler {






    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse>handleException(MethodArgumentNotValidException exp){
       Set<String> errors = new HashSet<>();
       exp.getBindingResult().getAllErrors().forEach(error -> {
           var errorMessage = error.getDefaultMessage();
           errors.add(errorMessage);
       });
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(
                        ExceptionResponse
                                .builder()
                                .validationErrors(errors)
                                .build()

                );


    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse>handleException(Exception exp){
       // log the exception for reading from the console
        exp.printStackTrace();
        return ResponseEntity
                .status(INTERNAL_SERVER_ERROR)
                .body(
                        ExceptionResponse
                                .builder()
                                .BusinessErrorDescription("Internal Server Error,contact admin")
                                .build()

                );


    }

    @ExceptionHandler(OperationNotPermitedException.class)
    public ResponseEntity<ExceptionResponse>handleException(OperationNotPermitedException exp){
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(
                        ExceptionResponse
                                .builder()
                                .error(exp.getMessage())
                                .build()

                );


    }
}
