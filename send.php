<?php

  $to = "vyshalina@gmail.com";

  $name = $_POST['name'];
  $subject = $_POST['subject'];
  $message_pole = $_POST['message'];

  $body = "
  Имя: $name
  Тема: $message_pole
  Сообщение: $message_pole";

  $from = "info@hookhack.site";
  $headers = "Reply-To: " . $from;
  $error_messages = array();

  if( strlen($name) < 1 ) {
    $error_messages[] = "name required";
  }

  if( strlen($body) < 1 ) {
    $error_messages[] = "comment required";
  }

  if( strlen($from) < 1 ) {
    $error_messages[] = "email required";
  }

  if (mail($to, $subject, $body, $headers)) {
    echo("success");
  } else {
    foreach( $error_messages as $error_message ) {
      echo "$error_message <br />";
    }
  }

?>
