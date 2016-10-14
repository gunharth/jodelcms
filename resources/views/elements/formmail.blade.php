@extends('mail.layout')

@section('content')

<!-- Email Body : BEGIN -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container">

    <!-- 1 Column Text : BEGIN -->
            <tr>
                <td bgcolor="#edeff2" style="padding: 20px; text-align: left; font-family: Arial, sans-serif; font-size: 50px; mso-height-rule: exactly; line-height: 55px; color: #ff7051;">
                     <b>New Form Submission</b>
                </td>
            </tr>
            <!-- 1 Column Text : BEGIN -->

    <!-- 1 Column Text : BEGIN -->
    <tr>
        <td bgcolor="#edeff2" style="padding: 20px; text-align: left; font-family: Arial, sans-serif; font-size: 16px; mso-height-rule: exactly; line-height: 21px; word-spacing: -1px; color: #464854;">
            @foreach($fields as $field)	
				<p>{{ $field['name'] }}: {!! nl2br(e($field['value'])) !!}</p>
			@endforeach
		</td>
    </tr>
    <!-- 1 Column Text : BEGIN -->

</table>
<!-- Email Body : END -->

@endsection