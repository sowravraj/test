import { useEffect, useState } from 'react';

const List = () => {
    const [name, setName] = useState('');
    const [buyLink, setBuyLink] = useState('');
    const [reviewLink, setReviewLink] = useState('');
    const [lists, setLists] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editId, setEditId] = useState(-1);
    const apiURL = "https://venderback-2.onrender.com";

    // Edit
    const [editName, setEditName] = useState('');
    const [editBuyLink, setEditBuyLink] = useState('');
    const [editReviewLink, setEditReviewLink] = useState('');

    const HandleSubmit = async () => {
        setError('');
        setMessage('');

        if (name.trim() === "" || buyLink.trim() === "" || reviewLink.trim() === "") {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch(apiURL + "/lists", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: name, buyingLink: buyLink, reviewLink })
            });

            if (response.ok) {
                const newList = await response.json();
                setLists([...lists, newList]);
                setMessage("Item added successfully");
                setName('');
                setBuyLink('');
                setReviewLink('');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                setError("Unable to add item");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(`Fetch error: ${err.message}`);
        }
    }

    useEffect(() => {
        getList();
    }, []);

    // Get all Lists
    const getList = () => {
        fetch(apiURL + "/lists")
            .then((res) => res.json())
            .then((res) => setLists(res))
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(`Fetch error: ${err.message}`);
            });
    }

    const HandleEdit = (list) => {
        setEditId(list._id);
        setEditName(list.title);
        setEditBuyLink(list.buyingLink);
        setEditReviewLink(list.reviewLink);
    }

    const HandleUpdate = async () => {
        setError('');
        setMessage('');

        if (editName.trim() === "" || editBuyLink.trim() === "" || editReviewLink.trim() === "") {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch(apiURL + "/lists/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editName, buyingLink: editBuyLink, reviewLink: editReviewLink })
            });

            if (response.ok) {
                const updatedList = lists.map((list) => {
                    if (list._id === editId) {
                        return { ...list, title: editName, buyingLink: editBuyLink, reviewLink: editReviewLink };
                    }
                    return list;
                });
                setLists(updatedList);
                setMessage("Item updated successfully");
                setEditId(-1);
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                setError("Unable to update item");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(`Fetch error: ${err.message}`);
        }
    }

    const HandleEditCancel = () => {
        setEditId(-1);
    }

    const HandleDelete = (id) => {
        if (window.confirm("Are you really want to delete?")) {
            fetch(apiURL + "/lists/" + id, {
                method: "DELETE"
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                // No need to parse the response as JSON since DELETE usually returns no content
                const updatedList = lists.filter((list) => list._id !== id);
                setLists(updatedList);
                setMessage("Item deleted successfully");
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(`Fetch error: ${err.message}`);
            });
        }
    }
    

    return (
        <>
            <div className="p-3 bg-success text-light d-flex justify-content-center gap-5">
                <h1 className="pr-5">Lists of Products - Vendor side</h1>
                <button className='btn btn-light '><a href="https://sowravraj.github.io/final/" className="text-decoration-none">Customer View</a></button>
            </div>
            <div className="row">
                <h3>Add Product</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        className="form-control w-50"
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Buying Link"
                        value={buyLink}
                        onChange={(e) => setBuyLink(e.target.value)}
                    />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Review Link"
                        value={reviewLink}
                        onChange={(e) => setReviewLink(e.target.value)}
                    />
                    <button className="btn btn-dark" onClick={HandleSubmit}>Submit</button>
                </div>
                {error && <p className='text-danger'>{error}</p>}
            </div>
            <div className='row mt-3'>
                <h3>Product's List</h3>
                <div className='col-md-15'>
                    <ul className='list-group'>
                        {lists.map((list) => (
                            <li key={list._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                                {
                                    editId === -1 || editId !== list._id ? <>
                                        <span className='fw-bold w-60'>{list.title}</span>
                                        <a href={list.buyingLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none w-10">Buying Link</a>
                                        <a href={list.reviewLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none w-10">Review Link</a>
                                    </> : <>
                                        <div className="form-group d-flex gap-2 me-2">
                                            <input
                                                className="form-control w-50"
                                                type="text"
                                                placeholder="Product Name"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Buying Link"
                                                value={editBuyLink}
                                                onChange={(e) => setEditBuyLink(e.target.value)}
                                            />
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Review Link"
                                                value={editReviewLink}
                                                onChange={(e) => setEditReviewLink(e.target.value)}
                                            />
                                        </div>
                                    </>
                                }
                                <div className='d-flex gap-2'>
                                    {
                                        editId === -1 || editId !== list._id ? <>
                                            <button className='btn btn-warning' onClick={() => HandleEdit(list)}>Edit</button>
                                        </> : <>
                                            <button className='btn btn-warning' onClick={HandleUpdate}>Update</button>
                                        </>
                                    }
                                    {
                                        editId === -1 || editId !== list._id ? <>
                                            <button className='btn btn-danger' onClick={() => HandleDelete(list._id)}>Delete</button>
                                        </> : <>
                                            <button className='btn btn-danger' onClick={HandleEditCancel}>Cancel</button>
                                        </>
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default List;
