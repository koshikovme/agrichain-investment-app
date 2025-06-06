package com.agriculturalmarket.investments.service.grpcclient;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import payment.PaymentServiceGrpc;
import payment.Payment.*;

@Service
public class PaymentGrpcClient {

    private final PaymentServiceGrpc.PaymentServiceBlockingStub stub;

    public PaymentGrpcClient(
            @Value("${grpc.payment.host:localhost}") String host,
            @Value("${grpc.payment.port:50051}") int port
    ) {
        ManagedChannel channel = ManagedChannelBuilder
                .forAddress(host, port)
                .usePlaintext()
                .build();

        stub = PaymentServiceGrpc.newBlockingStub(channel);
    }

    public PaymentResponse createPayment(CreatePaymentRequest createPaymentRequest) {
        return stub.createPayment(createPaymentRequest);
    }

    public PaymentResponse executePayment(ExecutePaymentRequest executePaymentRequest) {
        return stub.executePayment(executePaymentRequest);
    }

    public PaymentResponse getPayment(GetPaymentRequest getPaymentRequest) {
        return stub.getPayment(getPaymentRequest);
    }

    public ListPaymentsResponse listOfPayments(ListPaymentsRequest listPaymentsRequest) {
        return stub.listPayments(listPaymentsRequest);
    }
}
