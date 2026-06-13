document.getElementById("details")
.addEventListener("submit", function(event)
{
 event.preventDefault();
 let Name = document.getElementById("name").value;
 let Email = document.getElementById("mail").value;
 let Phone = document.getElementById("phone").value;
 let DOB = document.getElementById("dob").value;
 let Age = document.getElementById("age").value;
 let Address = document.getElementById("address").value;
 let Gender = document.querySelector('input[name="gender"]:checked').value;
 let Documents = [];
 document.querySelectorAll('input[type="checkbox"]:checked').forEach(function(item) {
     Documents.push(item.value);
 });

 document.getElementById("p1").innerText = "Name: " + Name;
 document.getElementById("p2").innerText = "Email: " + Email;
 document.getElementById("p3").innerText = "Mobile: " + Phone;
 document.getElementById("p4").innerText = "DOB: " + DOB;
 document.getElementById("p5").innerText = "Age: " + Age;
 document.getElementById("p6").innerText = "Gender: " + Gender;
 document.getElementById("p7").innerText = "Address: " + Address;
 document.getElementById("p8").innerText = "Documents: " + (Documents.length ? Documents.join(", ") : "None");
 let Image = document.getElementById("image").files[0];
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