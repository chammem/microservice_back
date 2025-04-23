package tn.esprit.profile_service.Exception;

public class OperationNotPermitedException extends RuntimeException {
    public OperationNotPermitedException(String msg) {
       super(msg);
    }
}
