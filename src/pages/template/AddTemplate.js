// import { addGmailTemplate, addKixieTemplate } from 'services/templateService';

// import React, { useState } from 'react';
// import {
//   Button,
//   Grid,
//   InputLabel,
//   OutlinedInput,
//   FormHelperText,
//   Stack,
//   Container,
//   Paper,
//   Select,
//   MenuItem,
//   TextField
// } from '@mui/material';
// import * as Yup from 'yup';
// import { Formik } from 'formik';

// const AddTemplate = ({ actionType, setActionType }) => {
//   const [preview, setPreview] = useState('');

//   const validationSchema = Yup.object().shape({
//     subject: Yup.string().required('Subject is required'),
//     status: Yup.string().required('Status is required'),
//     type: Yup.string().when('actionType', {
//       is: 'gmail',
//       then: Yup.string().required('Type is required')
//     }),
//     content: Yup.string().required('Content is required')
//   });

//   const handleSubmit = async (values) => {
//     try {
//       const payload = { ...values };

//       const actionFunction = {
//         gmail: addGmailTemplate,
//         kixie: addKixieTemplate
//       }[actionType];

//       if (actionType === 'gmail') {
//         if (values.type === 'html') {
//           payload.html = payload.content;
//           delete payload.content;
//         }
//         payload.cc = values.cc;
//         payload.bcc = values.bcc;
//       } else if (actionType === 'kixie') {
//         payload.name = payload.subject;
//         delete payload.subject;
//       }

//       if (actionFunction) {
//         const res = await actionFunction(payload);
//         if (res && !res.message) {
//           setActionType(null);
//         }
//       } else {
//         console.warn(`Invalid actionType: ${actionType}`);
//       }

//       // Uncomment below if you need to debug payload
//       // console.log("Result:", res, "Payload:", payload);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const handleCcKeyDown = (e, setFieldValue, values) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       const email = e.target.value.trim();
//       if (email) {
//         const newCc = [...values.cc, email];
//         setFieldValue('cc', newCc); // Update the 'cc' field in values
//         e.target.value = ''; // Reset the input value to an empty string
//       }
//     }
//   };

//   const handleBccKeyDown = (e, setFieldValue, values) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       const email = e.target.value.trim();
//       if (email) {
//         const newBcc = [...values.bcc, email];
//         setFieldValue('bcc', newBcc); // Update the 'bcc' field in values
//         e.target.value = ''; // Reset the input value to an empty string
//       }
//     }
//   };

//   return (
//     <Container style={{ position: 'fixed', top: '20%', width: '70%', height: '70vh', overflow: 'scroll' }}>
//       <Paper elevation={3} style={{ padding: '30px' }}>
//         {actionType && (
//           <Formik
//             initialValues={{
//               subject: '',
//               status: 'Active',
//               type: 'text',
//               content: '',
//               cc: [],
//               bcc: []
//             }}
//             validationSchema={validationSchema}
//             onSubmit={(values, { setSubmitting, setFieldValue }) => {
//               handleSubmit(values, setFieldValue);
//               setSubmitting(false);
//             }}
//           >
//             {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
//               <form noValidate onSubmit={handleSubmit}>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="subject">Subject</InputLabel>
//                       <OutlinedInput
//                         id="subject"
//                         name="subject"
//                         value={values.subject}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={Boolean(touched.subject && errors.subject)}
//                       />
//                       {errors.subject && touched.subject && <FormHelperText error>{errors.subject}</FormHelperText>}
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12}>
//                     <Stack spacing={1}>
//                       <InputLabel htmlFor="status">Status</InputLabel>
//                       <Select
//                         variant="outlined"
//                         id="status"
//                         name="status"
//                         value={values.status}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={Boolean(touched.status && errors.status)}
//                       >
//                         <MenuItem value={'active'}>Active</MenuItem>
//                         <MenuItem value={'inactive'}>In Active</MenuItem>
//                       </Select>
//                       {errors.status && touched.status && <FormHelperText error>{errors.status}</FormHelperText>}
//                     </Stack>
//                   </Grid>

//                   {actionType === 'gmail' && (
//                     <>
//                       <Container color="primary" sx={{ position: 'absolute', textAlign: 'center', fontWeight: 'bold' }}>
//                         Add Gmail Template
//                       </Container>
//                       <Grid item xs={12}>
//                         <Stack spacing={1}>
//                           <InputLabel htmlFor="type">Type</InputLabel>
//                           <Select labelId="type" id="type" name="type" value={values.type} onChange={handleChange} onBlur={handleBlur}>
//                             <MenuItem value="text">Text</MenuItem>
//                             <MenuItem value="html">HTML</MenuItem>
//                           </Select>
//                         </Stack>
//                       </Grid>

//                       <Grid item xs={12}>
//                         <Stack spacing={1}>
//                           <InputLabel htmlFor="content">Content</InputLabel>
//                           <OutlinedInput
//                             id="content"
//                             name="content"
//                             value={values.content}
//                             onChange={(e) => {
//                               handleChange(e);
//                               if (values.type === 'html') {
//                                 setPreview(e.target.value);
//                               }
//                             }}
//                             onBlur={handleBlur}
//                             error={Boolean(touched.content && errors.content)}
//                             multiline
//                           />
//                           {errors.content && touched.content && <FormHelperText error>{errors.content}</FormHelperText>}
//                           {values.type === 'html' && preview && <div dangerouslySetInnerHTML={{ __html: preview }} />}
//                         </Stack>
//                       </Grid>

//                       <Grid item xs={12}>
//                         <Stack spacing={1}>
//                           <InputLabel htmlFor="cc">CC</InputLabel>
//                           <TextField
//                             id="cc"
//                             name="cc"
//                             onBlur={handleBlur}
//                             variant="outlined"
//                             fullWidth
//                             multiline
//                             rows={3}
//                             onKeyDown={(e) => handleCcKeyDown(e, setFieldValue, values)}
//                             placeholder="Add email addresses separated by commas or press Enter"
//                             className="cc-input"
//                           />
//                           {values.cc.map((email, index) => (
//                             <span key={index} className="email-tag">
//                               {email}
//                             </span>
//                           ))}
//                         </Stack>
//                       </Grid>

//                       <Grid item xs={12}>
//                         <Stack spacing={1}>
//                           <InputLabel htmlFor="bcc">BCC</InputLabel>
//                           <TextField
//                             id="bcc"
//                             name="bcc"
//                             onBlur={handleBlur}
//                             variant="outlined"
//                             fullWidth
//                             multiline
//                             rows={3}
//                             onKeyDown={(e) => handleBccKeyDown(e, setFieldValue, values)}
//                             placeholder="Add email addresses separated by commas or press Enter"
//                             className="bcc-input"
//                           />
//                           {values.bcc.map((email, index) => (
//                             <span key={index} className="email-tag">
//                               {email}
//                             </span>
//                           ))}
//                         </Stack>
//                       </Grid>
//                     </>
//                   )}

//                   {actionType === 'kixie' && (
//                     <>
//                       <Container color="primary" sx={{ position: 'absolute', textAlign: 'center', fontWeight: 'bold' }}>
//                         Add Kixie Template
//                       </Container>
//                       <Grid item xs={12}>
//                         <Stack spacing={1}>
//                           <InputLabel htmlFor="content">Content</InputLabel>
//                           <OutlinedInput
//                             id="content"
//                             subject="content"
//                             value={values.content}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             error={Boolean(touched.content && errors.content)}
//                             multiline
//                           />
//                           {errors.content && touched.content && <FormHelperText error>{errors.content}</FormHelperText>}
//                         </Stack>
//                       </Grid>
//                     </>
//                   )}
//                   <Grid item xs={12}>
//                     <Button type="submit" variant="contained" color="primary">
//                       Save
//                     </Button>
//                     <Button onClick={() => setActionType(null)} variant="contained" color="secondary">
//                       Cancel
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             )}
//           </Formik>
//         )}
//       </Paper>
//     </Container>
//   );
// };

// export default AddTemplate;
