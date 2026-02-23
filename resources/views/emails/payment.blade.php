<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&family=Poppins:wght@100;300&family=Roboto:ital,wght@1,300&display=swap"
        rel="stylesheet">
    <title>None</title>
</head>

<body style="display: flex; align-items:center; justify-content:center;font-family: 'Roboto', sans-serif;">
    <div style="display: flex;  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;padding:2rem;">
        <div style="margin-left: 2rem;">
            <div style="line-height: normal; font-size: 14px; text-align: left; font-size:1rem;">

                <h3 style="font-weight: bold">Dear {{ $payment->student_name }}</h3>
                <div style="margin-left: 2rem;">
                    <div style="line-height: normal; font-size: 14px; text-align: left; font-size:1rem;">
                        <h1>Your payment is confirmed!</h1>
                        
                        <h4>You paid for {{ $payment->name }}</h4>
                        <h4>Description: {{ $payment->fee->description }}</h4>
                        <h4>Amount ₱{{ $payment->price }}</h4>
                        <h4>Recieved by {{ $payment->signed_by }}</h4>
                        <br />
                        <p>For assistance, contact us at customer.support.@gmail.com</p>
                        <br />
                        <p>TechCash Company</p>
                        <img style="width: 200px; height:100px"
                            src="{{ $message->embed(public_path('img/favicon.png')) }}" alt="Logo">
                    </div>
                </div>
            </div>
        </div>
</body>

</html>
