document.getElementById("details")
.addEventListener("submit", function(event)
{
 event.preventDefault();
 let Name = document.getElementById("name").value;
 let Email = document.getElementById("mail").value;
 let Phone = document.getElementById("phone").value;
 let Age = document.getElementById("age").value;
 let Gender = document.getElementById("gender").value;
 let Address = document.getElementById("address").value;
 document.getElementById("p1").innerText = "Name: " + Name;
 document.getElementById("p2").innerText = "Email: " + Email;
 document.getElementById("p3").innerText = "Mobile: " + Phone;
 document.getElementById("p4").innerText = "Age: " + Age;
 document.getElementById("p5").innerText = "Gender: " + Gender;
 document.getElementById("p6").innerText = "Address: " + Address;

 let Image= document.getElementById("image").files[0];
 if(Image)
 {
    let read = new FileReader();
    read.onload = function(e)
    {
        document.getElementById("dp").src = e.target.result;
    };
    read.readAsDataURL(Image);
 }
}
);